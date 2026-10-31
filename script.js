const intro=document.getElementById('intro');const button=document.getElementById('open');button.addEventListener('click',()=>{if(intro.classList.contains('opening'))return;button.disabled=true;intro.classList.add('opening');const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;setTimeout(()=>{intro.classList.add('is-hidden');document.body.style.overflow='';window.scrollTo({top:0,behavior:'instant'});setTimeout(()=>document.getElementById('content').focus({preventScroll:true}),150)},reduced?70:1500)});document.body.style.overflow='hidden';const photos=document.querySelectorAll('.page.reveal,.polaroid.reveal');const photoEffects=['photo-pop','photo-left','photo-right','photo-float','photo-pop','photo-left','photo-right','photo-float'];photos.forEach((el,i)=>el.classList.add(photoEffects[i%photoEffects.length]));const texts=document.querySelectorAll('.letter-block.reveal,.collage-copy.reveal,.short-quote.reveal');const textEffects=['text-rise','text-left','text-soft','text-rise'];texts.forEach((el,i)=>el.classList.add(textEffects[i%textEffects.length]));const items=document.querySelectorAll('.reveal');if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -30px 0px'});items.forEach(el=>observer.observe(el))}else items.forEach(el=>el.classList.add('visible'));
// Accessible full-screen gallery. Maintains original image order.
const galleryImages=Array.from(document.querySelectorAll('.photo-frame img,.polaroid img'));
const lightbox=document.createElement('div');
lightbox.className='photo-lightbox';
lightbox.setAttribute('role','dialog');
lightbox.setAttribute('aria-modal','true');
lightbox.setAttribute('aria-label','Просмотр фотографии');
lightbox.innerHTML='<button type="button" class="lb-close" aria-label="Закрыть фотографию">×</button><button type="button" class="lb-prev" aria-label="Предыдущая фотография">‹</button><img alt=""><button type="button" class="lb-next" aria-label="Следующая фотография">›</button><span class="lb-count" aria-live="polite"></span>';
document.body.appendChild(lightbox);
const largePhoto=lightbox.querySelector('img');
const counter=lightbox.querySelector('.lb-count');
let currentPhoto=0;
let returnFocus=null;
let oldOverflow='';
function renderPhoto(){const img=galleryImages[currentPhoto];largePhoto.src=img.currentSrc||img.src;largePhoto.alt=img.alt;counter.textContent=`${currentPhoto+1} / ${galleryImages.length}`;}
function showPhoto(index){currentPhoto=(index+galleryImages.length)%galleryImages.length;renderPhoto();}
function openPhoto(index){returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;showPhoto(index);lightbox.classList.add('is-open');document.body.style.overflow='hidden';lightbox.querySelector('.lb-close').focus();}
function closePhoto(){lightbox.classList.remove('is-open');document.body.style.overflow=oldOverflow;if(returnFocus&&returnFocus.focus)returnFocus.focus();}
galleryImages.forEach((img,index)=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`Открыть фотографию ${index+1} на весь экран`);img.addEventListener('click',()=>openPhoto(index));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPhoto(index);}});});
lightbox.querySelector('.lb-close').addEventListener('click',closePhoto);
lightbox.querySelector('.lb-prev').addEventListener('click',()=>showPhoto(currentPhoto-1));
lightbox.querySelector('.lb-next').addEventListener('click',()=>showPhoto(currentPhoto+1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closePhoto();});
document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('is-open'))return;if(e.key==='Escape')closePhoto();if(e.key==='ArrowLeft')showPhoto(currentPhoto-1);if(e.key==='ArrowRight')showPhoto(currentPhoto+1);if(e.key==='Tab'){const buttons=[...lightbox.querySelectorAll('button')];const idx=buttons.indexOf(document.activeElement);if(e.shiftKey&&idx<=0){e.preventDefault();buttons[buttons.length-1].focus();}else if(!e.shiftKey&&idx===buttons.length-1){e.preventDefault();buttons[0].focus();}}});
let touchStartX=null;lightbox.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX},{passive:true});lightbox.addEventListener('touchend',e=>{if(touchStartX===null)return;let dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>65)showPhoto(currentPhoto+(dx<0?1:-1));touchStartX=null},{passive:true});

// Subtle low-cost scroll parallax for background ornaments only.
const parallaxDecor=[...document.querySelectorAll('.floating-decoration .decor')];
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollScheduled=false;
function refreshParallax(){scrollScheduled=false;if(reduceMotion.matches)return;const y=window.scrollY;parallaxDecor.forEach((el,i)=>el.style.setProperty('--parallax-y',`${Math.round(Math.sin(i+1)*Math.min(36,y*.025))}px`));}
window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(refreshParallax)}},{passive:true});
const finale=document.querySelector('.finale');
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{for(const entry of entries){finale.classList.toggle('active',entry.isIntersecting)}},{threshold:.2}).observe(finale)}else finale.classList.add('active');
