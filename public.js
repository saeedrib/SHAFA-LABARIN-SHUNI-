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
    const {data:stories,error}=await db.from('stories').select('id,title,slug,summary,category,cover_url').eq('status','published').order('created_at',{ascending:false});
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
      const {data:episodes,error}=await db.from('episodes').select('id,title,body,episode_number,audio_url,is_locked,unlock_at').eq('story_id',story.id).eq('status','published').order('episode_number',{ascending:true});
      if(error){body.textContent='Ba a iya ɗauko labarin ba. '+error.message;return;}
      if(!episodes?.length){body.textContent='Ba a saka babi na wannan labari tukuna.';return;}
      body.textContent='';
      episodes.forEach((ep,index)=>{
        const part=document.createElement('section');part.style='padding:12px 0;border-bottom:1px solid #e9eee9';
        const h=document.createElement('h3');h.textContent=ep.title||('Babi na '+ep.episode_number);
        const text=document.createElement('p');text.className='storytext';text.textContent=ep.body||'';
        part.append(h);
        if(ep.is_locked){const locked=document.createElement('p');locked.className='meta';locked.textContent='Wannan babi a kulle yake.';part.append(locked);}
        else part.append(text);
        if(ep.audio_url&&!ep.is_locked){const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=ep.audio_url;audio.style='display:block;width:100%;margin-top:12px';part.append(audio);}
        body.append(part);
      });
    }
  }catch(err){console.error('Shafa public catalogue:',err);}
})();