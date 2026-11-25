# Shafa Labarin Shuni — Blogger + Supabase setup (Hausa)

An ƙara `blogger-theme.xml` domin amfani da Blogger a matsayin shafin jama'a. Ana barin Vercel da Supabase a matsayin tsarin gudanarwa da bayanai.

## Abubuwan da wannan theme ya tanada
- Zaɓin jinsi (Namiji/Mace) da adanawa a browser domin kada ya riƙa tambaya a kowane ziyara.
- Dashboard na "Cigaban Shirin", lokacin shiri na gaba da countdown.
- Jerin labarai daga `public.shafa_stories`.
- Karanta jadawalin babi ta RPC `get_shafa_episode_catalog(p_story_id)`.
- Wurin Live Radio da MP3 player, da yunƙurin daidaita mai shigowa daga tsakiyar sauti bisa lokacin farawa.
- Wurin shirye-shiryen da suka gabata.
- Wuraren Blogger Layout guda biyu domin saka Monetag: `ads-top` da `ads-bottom`.
- Hanyar shiga Admin na Vercel.

## Yadda ake saka theme a Blogger
1. Ka shiga Blogger dashboard na blog ɗinka.
2. Je zuwa **Theme**.
3. Danna kibiya kusa da **Customize**, sannan ka zaɓi **Edit HTML** ko **Restore** (idan Blogger ya ba da damar upload).
4. Ka ajiye tsohon theme ɗinka kafin canji.
5. Ka buɗe fayil ɗin `blogger-theme.xml` daga GitHub, ka kwafi cikakken XML, sannan ka saka shi a Edit HTML. Idan Blogger ya ƙi, ka mayar da kuskuren da ya nuna; kada ka goge tsohon theme har sai sabon ya shiga.
6. Je zuwa **Layout**. A wuraren `ads-top` ko `ads-bottom`, danna **Add a Gadget → HTML/JavaScript**, sannan ka saka Monetag code ɗinka.
7. Ka duba shafin a wayar Android da kwamfuta.

## Muhimman bayanai
- Theme ɗin yana amfani da Supabase URL da publishable/anon key na Shafa da ke cikin fayil ɗin. Wannan key na browser ne; kada a taɓa saka `service_role` key a Blogger ko wani JavaScript na jama'a.
- Kada ka share ko canza Supabase tables. Vercel admin ya ci gaba da amfani da `admin.html` da `admin-episodes.html`.
- Admin: https://shafa-blond.vercel.app/admin.html
- Sarrafa babi da jadawali: https://shafa-blond.vercel.app/admin-episodes.html
- Vercel public site na yanzu: https://shafa-blond.vercel.app
- Wannan sabon theme ba ya canza domain ɗinka kai tsaye. Bayan ka saka shi a Blogger, za ka iya haɗa custom domain daga **Settings → Publishing** na Blogger.
- Browser na waya kan hana autoplay idan mai amfani bai taɓa shafin ba. Saboda haka, idan rediyo bai fara da kansa ba, mai sauraro zai danna **Fara Sauraro** sau ɗaya. Wannan ƙuntatawar browser ce, ba kuskuren jadawalin ba.
- Late join na buƙatar MP3 ɗin shirin guda ɗaya ya zama continuous, kuma a saka lokacin farawa daidai. Idan an raba labari zuwa MP3 daban-daban, kowane sashe yana buƙatar jadawalinsa.
- Dole ne a gwada theme a Blogger da ainihin bayanan Supabase kafin a ɗauke shi a matsayin production-ready. Wannan commit bai canza Supabase schema ko bayanan da ke ciki ba.

## Monetag
A saka official Monetag code da aka ba ka kawai a HTML/JavaScript gadget. Ka tabbatar da bin dokokin Monetag da Blogger, sannan ka gwada cewa tallan ba ya toshe maɓallan sauraro ko jinkirta rediyo.
