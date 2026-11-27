import { categories, products, quickReferenceProducts, footer } from './data.js';

const root = document.querySelector('#nptel-plus-app');
const state = { menu: false, search: false, query: '', expandedFilters: new Set(['Price']), sort: 'Recommended', checked: new Set(), cart: [], modal: '', mobileNav: false };
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [name = '', ...rest] = raw.split('/');
  if (!name) return { page: 'home' };
  if (name === 'category') return { page: 'category', slug: rest[0] || 'all-products' };
  if (name === 'product') return { page: 'product', slug: rest.join('/') };
  if (name === 'account') return { page: 'account', section: rest[0] || 'my-account' };
  return { page: name, section: rest[0] || '' };
}
function go(path) { state.menu = false; state.search = false; state.mobileNav = false; location.hash = `#/${path}`; render(); window.scrollTo(0,0); }
function titleFor(r) {
  if (r.page === 'category') return categories.find(([,slug]) => slug === r.slug)?.[0] || 'All Products';
  return ({home:'Home',about:'About us','quick-reference':'Ongoing workshops',programs:'All Products',cart:'Cart',login:'Log In',certificates:'Certificates', 'course-access':'Course Access',verify:'Verify certificate'})[r.page] || '';
}
function header() {
  const r = route();
  return `<header class="np-header">
    <div class="np-brand"><a href="#/" aria-label="NPTEL+ Home"><img src="/assets/reference/nptel-logo.webp" alt="NPTEL+"/><span class="np-plus">+ <small>eLEARN</small></span></a></div>
    <button class="np-mobile-menu" aria-label="Menu" data-act="mobile-menu">☰</button>
    <nav class="np-nav ${state.mobileNav?'open':''}" aria-label="Main navigation">
      <a href="#/" class="${r.page==='home'?'active':''}">Home</a>
      <a href="#/programs" class="${r.page==='programs'||r.page==='category'?'active':''}">Programs</a>
      <a href="#/about" class="${r.page==='about'?'active':''}">About us</a>
      <a href="#/quick-reference" class="${r.page==='quick-reference'?'active':''}">Quick Reference</a>
    </nav>
    <div class="np-head-actions"><button class="np-search-icon" aria-label="Search" data-act="search">⌕</button>
      <div class="np-user-wrap"><button class="np-user" data-act="account-menu" aria-label="Account"><svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="#2166e8"/><circle cx="17" cy="12" r="5" fill="#fff"/><path d="M7.5 28c1.4-5.3 4.5-8 9.5-8s8.1 2.7 9.5 8" fill="#fff"/></svg><span>Aditya Lokhande</span><b>⌄</b></button>${state.menu?`<div class="np-account-menu"><a href="#/account/my-account">My Account</a><a href="#/account/profile">Profile</a><a href="#/certificates">Certificates</a><a href="#/account/my-orders">My Orders</a><a href="#/account/my-addresses">My Addresses</a><a href="#/account/my-wallet">My Wallet</a><a href="/">Course Access</a><a href="/login/">Log Out</a></div>`:''}</div>
      <a class="np-cart" href="#/cart" aria-label="Cart"><svg viewBox="0 0 28 38" role="img" aria-hidden="true"><path d="M9 14V9a5 5 0 0 1 10 0v5" fill="none" stroke="#2166e8" stroke-width="1.8"/><path d="M5.5 14h17l1.8 18.4a2 2 0 0 1-2 2.2H5.7a2 2 0 0 1-2-2.2L5.5 14Z" fill="#2166e8"/><text x="14" y="28" text-anchor="middle" fill="#fff" font-size="12" font-family="Arial,sans-serif">${state.cart.length}</text></svg></a>
    </div>
  </header>`;
}
function footerView() { return `<footer class="np-footer"><div><span>Workshop related queries:</span> <a href="mailto:${footer.workshop}">${footer.workshop}</a><br/><span>NPTEL Self -paced queries :</span> <a href="mailto:${footer.selfPaced}">${footer.selfPaced}</a></div><div><a class="np-address" href="https://www.google.com/maps/search/IIT+Madras" target="_blank" rel="noreferrer">ADDRESS : ${footer.address}</a></div><div>PHONE : ${footer.phone}</div></footer>`; }
function home() { return `<main class="np-home"><section class="np-home-hero"><div class="np-carousel" aria-label="Featured programs"><button aria-label="Previous item" data-act="hero-prev">‹</button><div class="np-hero-image"></div><button aria-label="Next item" data-act="hero-next">›</button></div></section><section class="np-institutes"><h1>COURSE OFFERING INSTITUTES</h1><img src="/assets/reference/nptel-logo.webp" alt="NPTEL"/></section></main>`; }
function productCards(list = products) { return `<div class="np-products">${list.map(([name,slug],i)=>`<article class="np-product"><a href="#/product/${slug}" class="np-product-image" aria-label="${esc(name)}"><span>${i+1}</span></a><a class="np-product-name" href="#/product/${slug}">${esc(name)}</a><button class="np-card-cart" data-act="add-cart" data-slug="${esc(slug)}">Add to Cart</button></article>`).join('')}</div>`; }
function filterOptions(label, opts) { const expanded = state.expandedFilters.has(label); return `<section class="np-filter"><button class="np-filter-toggle" data-act="filter" data-name="${label}">${label}<span>${expanded?'−':'+'}</span></button>${expanded?`<div class="np-filter-body">${label==='Price'?`<div class="np-price-labels"><span>₹0</span><span>₹118,000</span></div><input type="range" min="0" max="100" value="100" aria-label="Maximum price"/>`:(opts||[]).map(option=>`<label><input type="checkbox" data-filter-item="${esc(option)}" ${state.checked.has(option)?'checked':''}/> ${esc(option)}</label>`).join('')}</div>`:''}</section>`; }
function catalog(slug = 'all-products') {
  const pageTitle = categories.find(([,id])=>id===slug)?.[0] || 'All Products';
  const source=slug==='ongoing-workshops'?quickReferenceProducts:products;
  let filtered = source.filter(([name])=>!state.query || name.toLowerCase().includes(state.query.toLowerCase()));
  if(state.sort==='Name') filtered=[...filtered].sort((a,b)=>a[0].localeCompare(b[0]));
  const count=slug==='all-products'?578:slug==='ongoing-workshops'?105:filtered.length;
  return `<main class="np-catalog"><div class="np-crumb"><a href="#/">Home</a><span>›</span>${esc(pageTitle)}</div><div class="np-catalog-layout"><aside class="np-sidebar"><h1>${esc(pageTitle)}</h1><h2>Browse by</h2><div class="np-category-links">${categories.map(([name,id])=>`<a class="${id===slug?'current':''}" href="#/category/${id}">${esc(name)}</a>`).join('')}</div><h2 class="filter-title">Filter by</h2>${filterOptions('Price')}${filterOptions('Category',['Course','Course + Examination','College students','Faculty','Industry','Students','Teachers'])}${filterOptions('Institute',['IIT Madras','IIT Bombay','IIT Delhi','IIT Kharagpur','IIT Kanpur','IIT Roorkee','IIT Guwahati','IISc Bengaluru'])}${filterOptions('Type',['College Faculty','Default','Faculty','Faculty & Industry','Government','Industry','Industry expert','Others','Research scholars','School Teachers','Student','Students','Teachers/Academia'])}${filterOptions('Custom Filter',['Ongoing','Completed'])}</aside><section class="np-results"><div class="np-result-toolbar"><span>${state.query?filtered.length:count} products</span><label>Sort by: <select data-act="sort"><option ${state.sort==='Recommended'?'selected':''}>Recommended</option><option ${state.sort==='Price: Low to High'?'selected':''}>Price: Low to High</option><option ${state.sort==='Price: High to Low'?'selected':''}>Price: High to Low</option><option ${state.sort==='Name'?'selected':''}>Name</option></select></label></div>${productCards(filtered)}</section></div></main>`;
}
function about() { return `<main class="np-about"><div class="np-about-image"></div><section><h1>NPTEL</h1><p>3rd Floor, ICSR Building,<br/>IIT Madras, Chennai - 600036<br/>Email: support-elearn@nptel.iitm.ac.in</p></section><article><p>National Programme on Technology Enhanced Learning (NPTEL), implemented using information and communication technology (ICT), is India’s largest technical dissemination program involving seven IITs (Bombay, Delhi, Guwahati, Kanpur, Kharagpur, Madras and Roorkee) and IISc, Bengaluru. Together, several web and video-based materials for science and engineering courses have been developed.</p><p>NPTEL courses are used extensively by faculty members and students across the world to further their knowledge on various subjects in different disciplines. The courses developed for NPTEL can be viewed at <a href="https://nptel.ac.in/">nptel.ac.in</a> and on YouTube (as a separate channel, at <a href="https://www.youtube.com/iit">youtube.com/iit</a>).</p><p>NPTEL is launching the new portal NPTEL+ to expand the variety of offerings and courses for learner upskilling. 3 types of training programs are proposed currently:</p><h2>1. NPTEL courses in self paced mode</h2><p>NPTEL is now offering self-paced courses where learners may progress through the course and complete assignments at their own pace. Once a learner joins these courses, they may watch video lectures, and complete assignments as per their convenience. Learners may also choose to write a remote proctored online exam from the comfort of their homes and earn a certificate.</p><h2>2. Short term training programs from the IITs/IISc</h2><p>Short term training programs which might involve fully live lectures coupled with hands-on training or a blended mode of learning (recorded videos+live lectures) are planned to be offered. These would primarily be by the faculty of various IITs, IISc, etc and would be on fixed dates with fixed timings for the sessions.</p><h2>3. Other programs</h2><p>These programs include courses from institutes/organizations that are partnering with NPTEL. The contents are targeted towards specialised courses in an emerging technology or complementing the existing NPTEL courses with dedicated hands on content to equip the learners to be industry ready.</p></article></main>`; }
function memberShell(content, active) { return `<main class="np-member"><div class="np-member-notice">Welcome to our new Elearn Portal. If you can't see your previous purchases, you may go to our older portal <a href="https://archive-elearn.nptel.ac.in/">here</a>.</div><div class="np-member-cover"><div class="np-member-avatar">A</div><strong>Aditya Lokhande</strong><button aria-label="More actions">⋮</button></div><nav class="np-member-nav">${[['my-account','My Account'],['profile','Profile'],['my-orders','My Orders'],['my-addresses','My Addresses'],['my-wallet','My Wallet']].map(([id,label])=>`<a class="${active===id?'active':''}" href="#/account/${id}">${label}</a>`).join('')}</nav><section class="np-member-content">${content}</section></main>`; }
function accountPage(section) {
  if(section==='my-orders') return memberShell(`<h1>My Orders</h1><p>View your order history or check the status of a recent order.</p><hr/><div class="np-empty">You haven't placed any orders yet.<a href="#/programs">Start Browsing</a></div>`,section);
  if(section==='my-addresses') return memberShell(`<h1>My Addresses</h1><p>Add and manage the addresses you use often.</p><hr/><div class="np-empty">You haven't saved any addresses yet.<button class="np-blue-button" data-act="add-address">Add New Address</button></div>`,section);
  if(section==='my-wallet') return memberShell(`<h1>Wallet</h1><p>Save your payment details for faster checkout.</p><hr/><div class="np-wallet-empty"><h2>You haven’t saved any payment methods yet</h2><p>Securely save your payment details for faster checkout whenever you place an order.</p></div>`,section);
  return memberShell(`<h1>Account</h1><p>View and edit your personal info below.</p><div class="np-form-head"><button data-act="discard">Discard</button><button class="np-blue-button" data-act="update-info">Update Info</button></div><section class="np-form-section"><h2>Display info</h2><p>This information will be visible to all members of this site.</p><label>Display name *<input type="text" name="display-name"/></label><label>Title<input type="text" name="title"/></label><label>Profile image<input type="file" accept="image/*"/></label></section><section class="np-form-section"><h2>Personal info</h2><p>Update your personal information.</p><label>First name<input type="text" name="first-name"/></label><label>Last name<input type="text" name="last-name"/></label><label>Phone<input type="tel" name="phone"/></label><button class="np-blue-button" data-act="update-info">Update Info</button></section><section class="np-form-section"><h2>Login info</h2><p>View and update your login email and password.</p><div class="np-login-row">Login email: <span>••••••••••••••••</span><button data-act="change-email">Change Email</button></div><div class="np-login-row">Password: ● ● ● ● ● ● <button data-act="change-password">Change Password</button></div></section><section class="np-form-section"><h2>Visibility and privacy</h2><p>Update your personal information.</p>${['Profile URL','Profile privacy','Blocked members'].map(x=>`<details><summary>${x}</summary></details>`).join('')}</section>`,section);
}
function simpleEmpty(title,desc,empty,link='') { return `<main class="np-simple-page"><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}<div class="np-simple-rule"></div><section class="np-empty"><strong>${empty}</strong>${link?`<a href="#/${link}">Start Browsing</a>`:''}</section></main>`; }
function render() {
  const r = route(); const title = titleFor(r); let body = '';
  if(r.page==='home') body=home();
  else if(r.page==='programs') body=catalog('all-products');
  else if(r.page==='category') body=catalog(r.slug);
  else if(r.page==='about') body=about();
  else if(r.page==='quick-reference') body=catalog('ongoing-workshops');
  else if(r.page==='account') body=accountPage(r.section);
  else if(r.page==='certificates') body=simpleEmpty('My Certificates',`Certificates for your account`,'No certificates yet');
  else if(r.page==='course-access') { location.href='/'; return; }
  else if(r.page==='cart') body=state.cart.length?`<main class="np-simple-page"><h1>Cart</h1><p>Review the items in your cart.</p><div class="np-cart-list">${state.cart.map((slug,index)=>{const item=products.find(([,id])=>id===slug)||quickReferenceProducts.find(([,id])=>id===slug);return `<div><span>${esc(item?.[0]||'Program')}</span><button data-act="remove-cart" data-index="${index}">Remove</button></div>`;}).join('')}</div></main>`:simpleEmpty('Cart','Review the items in your cart.','Your cart is empty','programs');
  else if(r.page==='login') { location.replace('/login/'); return; }
  else if(r.page==='verify') body=`<main class="np-simple-page"><h1>Verify certificate</h1><form class="np-verify-form"><label>Certificate ID<input type="text" required/></label><button class="np-blue-button">Verify</button></form></main>`;
  else if(r.page==='reset-password') body=`<main class="np-login-page"><section class="np-login-card"><h1>Reset password</h1><p>Enter your email address to reset your password.</p><form class="np-reset-form"><label>Email<input type="email" required/></label><button class="np-blue-button">Send reset link</button><a href="#/login">Back to Log In</a></form></section></main>`;
  else if(r.page==='product') { const item=products.find(([,slug])=>slug===r.slug); body=`<main class="np-product-detail"><a href="#/programs">‹ Back to Programs</a><section><div class="np-detail-image"></div><div><h1>${esc(item?.[0]||'Program')}</h1><button class="np-blue-button" data-act="add-cart" data-slug="${esc(r.slug)}">Add to Cart</button></div></section></main>`; }
  else body=simpleEmpty(title||'NPTEL+','','');
  root.innerHTML=`<div class="np-site">${header()}${state.search?`<div class="np-search-scrim"><section class="np-search-panel"><div class="np-search-row"><input autofocus type="search" aria-label="Search" placeholder="Search..." value="${esc(state.query)}" data-act="query"/><button aria-label="Close" data-act="close-search">×</button></div><h2>Products</h2>${productCards(products.filter(([name])=>!state.query||name.toLowerCase().includes(state.query.toLowerCase())).slice(0,4))}<h2>Other Pages</h2><div class="np-search-pages"><a href="#/certificates">Certificates | NPTEL+</a><a href="/">Course Access | NPTEL+</a><a href="#/verify">Verify certificate | NPTEL+</a></div><button class="np-blue-button" data-act="search-all">Show All Results</button></section></div>`:''}${body}${footerView()}${state.modal?modalView():''}</div>`;
  document.title = `${title||'NPTEL+'} | NPTEL+`;
}
function modalView() { const change=state.modal==='change-email'||state.modal==='change-password'; return `<div class="np-modal-backdrop" data-act="modal-close"><section class="np-modal" role="dialog" aria-modal="true" aria-label="${esc(state.modal)}"><button class="np-modal-close" aria-label="Close" data-act="modal-close">×</button><h2>${state.modal==='address'?'Add New Address':state.modal==='change-email'?'Change Email':state.modal==='change-password'?'Change Password':state.modal==='added'?'Added to Cart':'Update Info'}</h2>${state.modal==='address'?`<form data-form="address"><label>Full name<input required/></label><label>Address<input required/></label><label>City<input required/></label><label>Postal code<input required/></label><button class="np-blue-button">Save Address</button></form>`:change?`<form data-form="change"><label>${state.modal==='change-email'?'New email':'Current password'}<input required type="${state.modal==='change-email'?'email':'password'}"/></label>${state.modal==='change-password'?'<label>New password<input required type="password"/></label>':''}<button class="np-blue-button">Save</button></form>`:state.modal==='added'?`<p>This item is in your cart.</p><a class="np-blue-button" href="#/cart">View Cart</a>`:`<p>Your information has been updated.</p><button class="np-blue-button" data-act="modal-close">Close</button>`}</section></div>`; }

root.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b)return; const act=b.dataset.act;
  if(act==='account-menu'){state.menu=!state.menu;render();}
  else if(act==='search'){state.search=true;state.query='';render();root.querySelector('input[type=search]')?.focus();}
  else if(act==='close-search'){state.search=false;render();}
  else if(act==='filter'){state.expandedFilters.has(b.dataset.name)?state.expandedFilters.delete(b.dataset.name):state.expandedFilters.add(b.dataset.name);render();}
  else if(act==='mobile-menu'){state.mobileNav=!state.mobileNav;render();}
  else if(act==='add-address'){state.modal='address';render();}
  else if(act==='update-info'){state.modal='updated';render();}
  else if(act==='discard'){root.querySelectorAll('.np-member-content input').forEach(i=>i.value='');}
  else if(act==='change-email'||act==='change-password'){state.modal=act;render();}
  else if(act==='modal-close'&&e.target.closest('.np-modal')){state.modal='';render();}
else if(act==='add-cart'){state.cart.push(b.dataset.slug);state.modal='added';render();}
  else if(act==='remove-cart'){state.cart.splice(Number(b.dataset.index),1);render();}
  else if(act==='search-all'){state.search=false;go('programs');}
  else if(act==='hero-next'||act==='hero-prev'){state.hero=(state.hero||0)+(act==='hero-next'?1:-1);const hero=root.querySelector('.np-hero-image');if(hero)hero.dataset.slide=String(Math.abs(state.hero)%3);}
});
root.addEventListener('input',e=>{
  if(e.target.matches('[data-act="query"]')){const cursor=e.target.selectionStart;state.query=e.target.value;render();const input=root.querySelector('[data-act="query"]');input?.focus();input?.setSelectionRange(cursor,cursor);}
  if(e.target.matches('[data-filter-item]')){const value=e.target.dataset.filterItem;e.target.checked?state.checked.add(value):state.checked.delete(value);}
});
root.addEventListener('change',e=>{if(e.target.matches('[data-act="sort"]')){state.sort=e.target.value;render();}});
root.addEventListener('submit',e=>{
  if(e.target.matches('.np-verify-form')){e.preventDefault();e.target.insertAdjacentHTML('beforeend','<p class="np-form-message">Certificate details could not be verified.</p>');}
  if(e.target.dataset.form==='address'||e.target.dataset.form==='change'){e.preventDefault();state.modal='updated';render();}
});
window.addEventListener('hashchange',()=>{state.menu=false;state.search=false;state.modal='';render();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){state.search=false;state.menu=false;state.modal='';render();}});
render();
