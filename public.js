/* Public story catalogue: uses Supabase when config.js is present; keeps demo cards otherwise. */
(async function(){
  const cfg=window.SHAFA_CONFIG;
  if(!cfg?.supabaseUrl||!cfg?.supabaseAnonKey||cfg.supabaseUrl.includes('YOUR-PROJECT')) return;
  const loadSdk=()=>new Promise((resolve,reject)=>{
    if(window.supabase?.createClient)return resolve();
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload=resolve;s.onerror=()=>reject(new Error('Ba a iya ɗauko Supabase ba.'));document.head.appendChild(s);
  });
  const grid=document.getElementById('storyGrid');
  const reader=document.getElementById('reader');
  const title=document.getElementById('readerTitle');
  const body=document.getElementById('storyText');
  if(!grid||!reader||!title||!body)return;
  try{
    await loadSdk();
    const db=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    const {data:stories,error}=await db.from('shafa_stories').select('id,title,slug,summary,category,cover_url').eq('status','published').order('created_at',{ascending:false});
    if(error)throw error;
    if(!stories?.length){grid.innerHTML='<p class="empty" style="display:block">Babu labari da aka wallafa tukuna.</p>';return;}
    grid.innerHTML='';
    for(const story of stories){
      const card=document.createElement('article');card.className='card';card.dataset.title=story.title;
      const cover=document.createElement('div');cover.className='cover';
      if(story.cover_url){const img=document.createElement('img');img.src=story.cover_url;img.alt='Murfin '+story.title;img.loading='lazy';img.style='width:100%;height:100%;object-fit:cover';cover.append(img);}else cover.textContent='📖';
      const section=document.createElement('div');section.className='card-body';
      const tag=document.createElement('span');tag.className='tag';tag.textContent=story.category||'Labarai';
      const h=document.createElement('h3');h.textContent=story.title;
      const p=document.createElement('p');p.textContent=story.summary||'Buɗe labarin domin karantawa.';
      const button=document.createElement('button');button.className='read';button.textContent='Karanta labari →';
      button.addEventListener('click',()=>openStory(story));
      section.append(tag,h,p,button);card.append(cover,section);grid.append(card);
    }
    async function openStory(story){
      title.textContent=story.title;body.textContent='Ana ɗauko labari…';reader.classList.add('open');reader.scrollIntoView({behavior:'smooth',block:'start'});
      const {data:episodes,error}=await db.rpc('get_shafa_episode_catalog',{p_story_id:story.id});
      if(error){body.textContent='Ba a iya ɗauko babi ba. '+error.message;return;}
      if(!episodes?.length){body.textContent='Ba a saka babi na wannan labari tukuna.';return;}
      body.textContent='';
      for(const ep of episodes){
        const part=document.createElement('section');part.style='padding:12px 0;border-bottom:1px solid #e9eee9';
        const h=document.createElement('h3');h.textContent=(ep.episode_number||'')+'. '+(ep.title||'Babi');
        part.append(h);
        const scheduledOpen=ep.unlock_at && new Date(ep.unlock_at).getTime()<=Date.now();
        if(ep.is_locked && !scheduledOpen){
          const locked=document.createElement('p');locked.className='meta';locked.textContent=ep.unlock_at?'An kulle wannan babi. Za a buɗe shi a '+new Date(ep.unlock_at).toLocaleString('ha-NG')+'.':'An kulle wannan babi a yanzu.';part.append(locked);
        }else{
          const {data:content,error:contentError}=await db.from('shafa_episodes').select('body').eq('id',ep.id).maybeSingle();
          const text=document.createElement('p');text.className='storytext';text.textContent=contentError?'Ba a iya buɗe rubutun babin ba.':(content?.body||'');part.append(text);
          if(ep.audio_url){const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=ep.audio_url;audio.style='display:block;width:100%;margin-top:12px';part.append(audio);}
        }
        body.append(part);
      }
    }
  }catch(err){console.error('Shafa public catalogue:',err);}
})();