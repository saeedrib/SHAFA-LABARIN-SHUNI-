/* Shafa Labarin Shuni: kundin jama'a da buɗe babi ta hanyar ziyartar talla. */
(async function(){
  const cfg=window.SHAFA_CONFIG;
  if(!cfg?.supabaseUrl||!cfg?.supabaseAnonKey||cfg.supabaseUrl.includes('YOUR-PROJECT')) return;
  const loadSdk=()=>new Promise((resolve,reject)=>{
    if(window.supabase?.createClient)return resolve();
    const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload=resolve;s.onerror=()=>reject(new Error('Ba a iya haɗa tsarin bayanai ba.'));document.head.appendChild(s);
  });
  const grid=document.getElementById('storyGrid'),reader=document.getElementById('reader');
  const title=document.getElementById('readerTitle'),body=document.getElementById('storyText');
  if(!grid||!reader||!title||!body)return;
  const searchInput=document.getElementById('search');
  const emptyNotice=document.getElementById('empty');
  function filterCards(){
    const q=(searchInput?.value||'').trim().toLocaleLowerCase('ha');
    let shown=0;
    grid.querySelectorAll('.card').forEach(card=>{
      const match=(card.dataset.title||'').toLocaleLowerCase('ha').includes(q);
      card.style.display=match?'':'none'; if(match)shown++;
    });
    if(emptyNotice)emptyNotice.style.display=shown?'none':'block';
  }
  searchInput?.addEventListener('input',filterCards);
    const AD_URL='https://uplcm.com/4/11653656';
  try{
    await loadSdk();
    const db=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    const {data:stories,error}=await db.from('shafa_stories').select('id,title,slug,summary,category,cover_url').eq('status','published').order('created_at',{ascending:false});
    if(error)throw error;
    if(!stories?.length){grid.innerHTML='<p class="empty" style="display:block">Ba a wallafa wani labari tukuna.</p>';return;}
    grid.innerHTML='';
    for(const story of stories){
      const card=document.createElement('article');card.className='card';card.dataset.title=story.title;
      const cover=document.createElement('div');cover.className='cover';
      if(story.cover_url){const img=document.createElement('img');img.src=story.cover_url;img.alt='Murfin '+story.title;img.loading='lazy';img.style='width:100%;height:100%;object-fit:cover';cover.append(img);}else cover.textContent='📖';
      const section=document.createElement('div');section.className='card-body';
      const tag=document.createElement('span');tag.className='tag';tag.textContent=story.category||'Labarai';
      const h=document.createElement('h3');h.textContent=story.title;
      const p=document.createElement('p');p.textContent=story.summary||'Buɗe wannan labari domin karantawa.';
      const button=document.createElement('button');button.className='read';button.textContent='Karanta labari ←';
      button.addEventListener('click',()=>openStory(story));
      section.append(tag,h,p,button);card.append(cover,section);grid.append(card);
      filterCards();
    }
    async function ensureReaderSession(){
      let {data:{session}}=await db.auth.getSession();
      if(!session){const {data,error}=await db.auth.signInAnonymously();if(error)throw new Error('Ba a kunna damar karatu ta baƙo ba tukuna. A sanar da mai kula da shafin.');session=data.session;}
      return session;
    }
    async function unlockEpisode(ep,button,status){
      button.disabled=true;button.textContent='Ana buɗewa…';
      try{
        const session=await ensureReaderSession();
        const {error}=await db.from('shafa_episode_unlocks').upsert({
          user_id:session.user.id,episode_id:ep.id,unlock_method:'rewarded_ad'
        },{onConflict:'user_id,episode_id'});
        if(error)throw error;
        status.textContent='An karɓi tabbacin ziyartar talla. Ana buɗe babin…';
        await renderEpisodeBody(ep,button.parentElement);
      }catch(err){status.textContent='Ba a iya buɗe babin ba: '+err.message;button.disabled=false;button.textContent='Na dawo daga talla — buɗe babi';}
    }
    async function renderEpisodeBody(ep,container){
      const {data:content,error}=await db.from('shafa_episodes').select('body').eq('id',ep.id).maybeSingle();
      if(error||!content){const p=document.createElement('p');p.className='meta';p.textContent='Ba a samu rubutun babin ba. A sake gwadawa.';container.append(p);return;}
      const p=document.createElement('p');p.className='storytext';p.textContent=content.body||'';container.append(p);
      if(ep.audio_url){const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=ep.audio_url;audio.style='display:block;width:100%;margin-top:12px';container.append(audio);}
    }
    async function openStory(story){
      title.textContent=story.title;body.textContent='Ana ɗauko babi…';reader.classList.add('open');reader.scrollIntoView({behavior:'smooth',block:'start'});
      const {data:episodes,error}=await db.rpc('get_shafa_episode_catalog',{p_story_id:story.id});
      if(error){body.textContent='Ba a iya ɗauko babi ba. A sake gwadawa.';return;}
      if(!episodes?.length){body.textContent='Ba a saka babi na wannan labari tukuna.';return;}
      body.textContent='';
      for(const ep of episodes){
        const part=document.createElement('section');part.style='padding:14px 0;border-bottom:1px solid #e9eee9';
        const h=document.createElement('h3');h.textContent='Babi na '+(ep.episode_number||'')+': '+(ep.title||'');part.append(h);
        const scheduledOpen=ep.unlock_at&&new Date(ep.unlock_at).getTime()<=Date.now();
        if(ep.is_locked&&!scheduledOpen){
          const info=document.createElement('p');info.className='meta';info.textContent='An kulle wannan babi. Ba sai ka biya kuɗi ba: buɗe tallar domin ci gaba.';part.append(info);
          const ad=document.createElement('a');ad.href=AD_URL;ad.target='_blank';ad.rel='noopener noreferrer';ad.className='btn';ad.textContent='Buɗe Talla';ad.style='display:inline-block;margin:4px 8px 8px 0';part.append(ad);
          const confirm=document.createElement('button');confirm.className='btn secondary';confirm.textContent='Na dawo daga talla — buɗe babi';
          const status=document.createElement('p');status.className='meta';status.textContent='Bayan ka buɗe tallar, ka dawo nan ka danna maɓallin nan.';
          confirm.addEventListener('click',()=>unlockEpisode(ep,confirm,status));part.append(confirm,status);
        }else{
          await renderEpisodeBody(ep,part);
        }
        body.append(part);
      }
    }
  }catch(err){console.error('Shafa:',err);const msg=document.createElement('p');msg.className='empty';msg.style.display='block';msg.textContent='An samu matsala wajen ɗauko labarai. A sake buɗe shafin.';grid.replaceChildren(msg);}
})();