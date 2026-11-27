import { course, modules, objectives, assignmentInstructions, reviewQuestions, icon } from './data.js';

const app = document.querySelector('#app');
const state = {
  view: 'overview', expanded: new Set(), selectedLesson: 0, selectedWeek: 0,
  lessonTab: 'Objectives', openPanel: '', gradeFilter: 'All', announcementFilter: 'All',
  theme: localStorage.getItem('nptel-theme') || 'System', playing: false, autoScroll: true,
  calc: '0', calcFresh: true
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const lessonList = modules.slice(0, 8).flatMap((week, weekIndex) => week.lessons.map((title, index) => ({ title, weekIndex, index, type: title === 'Lecture Materials' ? 'Lesson' : 'Video' })));
const lesson = () => lessonList[state.selectedLesson] || lessonList[0];
const currentWeek = () => modules[state.selectedWeek] || modules[0];
const mediaIcon = (type) => icon(type === 'Video' ? 'video' : type === 'Assignment' ? 'assignment' : 'book', 18);

function routeFromHash() {
  const [, name = 'overview', id = ''] = location.hash.match(/^#\/?([^/]+)\/?(.*)$/) || [];
  if (name === 'lesson') {
    const parsed = Number(id);
    state.selectedLesson = Number.isFinite(parsed) ? Math.max(0, Math.min(parsed, lessonList.length - 1)) : 0;
    state.view = 'lesson';
  } else if (name === 'assignment') {
    state.selectedWeek = Math.max(0, Math.min((Number(id) || 1) - 1, 7)); state.view = 'assignment';
  } else if (['contents','grades','overview'].includes(name)) state.view = name;
  render();
}
function go(name, id = '') { history.pushState(null, '', `#/${name}${id === '' ? '' : `/${id}`}`); routeFromHash(); window.scrollTo(0, 0); }

function header() {
  const page = state.view === 'lesson' ? 'Contents' : state.view === 'assignment' ? 'Grades' : state.view === 'review' ? `Week ${state.selectedWeek+1}` : state.view[0].toUpperCase() + state.view.slice(1);
  const unitTitle=state.view==='lesson'?lesson().title:state.view==='review'?`Week ${state.selectedWeek+1}: Assignment ${state.selectedWeek+1}`:`${modules[state.selectedWeek]?.title}: Assignment ${state.selectedWeek+1}`;
  return `<header class="topbar">
    <div class="brand"><img src="/assets/reference/nptel-logo.webp" alt="NPTEL"><div class="mobile-page"><strong>${page}</strong><span>${course.title}</span></div><button class="desktop-course" data-action="overview">${course.title}</button></div>
    ${state.view === 'lesson' || state.view === 'assignment' ? `<button class="back-course" data-action="overview">${icon('back',17)}<span>Back to course</span></button>` : state.view==='review'?`<button class="back-course" data-action="assignment-back">${icon('back',17)}<span>Back to start page</span></button>`:''}
    <nav class="desktop-actions" aria-label="Course actions">
      ${state.view !== 'overview' ? '' : ''}
      <button class="top-action ${state.view==='contents'?'selected':''}" data-action="contents">${icon('list',17)} Contents</button>
      <button class="top-action ${state.view==='grades'?'selected':''}" data-action="grades">${icon('chart',17)} Grades</button>
      ${state.view==='lesson' ? `<button class="top-action" data-action="calculator">${icon('calculator',17)} Calculator</button>` : ''}
      <button class="icon-action announcement-action" aria-label="Announcements" data-action="announcements">${icon('megaphone',19)}</button>
      <button class="avatar" aria-label="Account" data-action="account">A</button>
    </nav>
    ${state.view === 'lesson' ? `<div class="mobile-course-actions"><button aria-label="Contents" data-action="contents">${icon('list',20)}</button><button aria-label="Grades" data-action="grades">${icon('chart',20)}</button><button aria-label="Calculator" data-action="calculator">${icon('calculator',20)}</button><button aria-label="Announcements" data-action="announcements">${icon('megaphone',20)}</button><button class="avatar" aria-label="Account" data-action="account">A</button></div>` : ''}
    ${['lesson','assignment','review'].includes(state.view)?`<div class="mobile-unit-heading"><button aria-label="Back to course outline" data-action="contents">${icon('back',20)}</button><div><small>WEEK ${state.selectedWeek+1}</small><strong>${escapeHtml(unitTitle)}</strong></div><button class="unit-state" aria-label="Lesson status">◉⌄</button></div>`:''}
  </header>`;
}

function bottomNav() {
  const items = [['overview','home','Overview'],['contents','list','Contents'],['grades','chart','Grades'],['more','grid','More'],['account','user','Account']];
  return `<nav class="bottom-nav" aria-label="Course"><div class="bottom-items">${items.map(([action,ico,label]) => `<button class="bottom-item ${state.view===action || (action==='more'&&state.openPanel==='more') || (action==='account'&&state.openPanel==='account')?'active':''}" data-action="${action}"><span class="bottom-icon">${action==='account'?'<span class="avatar">A</span>':icon(ico,21)}</span><span>${label}</span></button>`).join('')}</div></nav>`;
}

function overview() {
  const totalLessons = modules.reduce((total, week) => total + week.lessons.length, 0);
  return `<main class="page overview-page">
    <section class="course-card">
      <div class="course-card-top"><img class="course-cover" src="/assets/reference/course-5g.jpg" alt="Course illustration">
        <div class="course-heading"><h1>${course.title}</h1><p class="instructor">${icon('user',17)} Instructor: ${course.instructor}</p>
          <div class="badges"><span>${icon('clock',16)} Self paced</span><span>${icon('certificate',16)} ${course.certificate}</span></div>
        </div>
      </div>
      <div class="course-card-bottom">
        <div class="enrollment-dates"><div><small>ENROLLED ON</small><strong>${course.enrolledOn}</strong></div><div><small>ACCESS UNTIL</small><strong>${course.accessUntil}</strong></div></div>
        <div class="progress-section"><div class="progress-label"><small>COURSE PROGRESS</small><strong>${course.progress}% complete</strong></div><div class="progress-track"><span style="width:${course.progress}%"></span></div><small class="progress-caption">${course.assignmentsSubmitted} of ${course.assignmentsSubmitted} assignments submitted</small></div>
        <div class="hero-actions"><button class="primary-button" data-action="continue">Continue learning ${icon('arrow',17)}</button><button class="green-button" data-action="register">Register for exam</button></div>
      </div>
    </section>
    <section class="course-information"><h2>CRITERIA TO GET A CERTIFICATE</h2><ul>${course.criteria.map(text=>`<li>${escapeHtml(text)}</li>`).join('')}</ul>
      <h2>EXAM FEE</h2><ul>${course.fees.map(text=>`<li>${escapeHtml(text)}</li>`).join('')}</ul>
      <p class="thank-you">Thank you for your interest in our online courses and certification. Happy learning.</p>
    </section>
    <section class="modules-preview"><div class="section-heading"><h2>${icon('list',19)} Course contents</h2><span>11 modules <b>•</b> ${totalLessons} lessons <b>•</b> 8 assignments</span></div>
      <div class="preview-list">${modules.map((item,index)=>`<button class="preview-row" data-action="open-module" data-week="${index}"><span class="row-chevron">${icon('chevron',17)}</span><span class="preview-title">${escapeHtml(item.title)}</span><span class="preview-meta">${index<8?`${item.lessons.length} lessons　1 assignment`: '1 lesson'}</span>${index<8?`<span class="complete-label">Complete</span><span class="mini-progress"><i></i></span><small>1 of 1 submitted</small>`:''}</button>`).join('')}</div>
    </section>
  </main>`;
}

function courseContents({ sidebar = false } = {}) {
  return `<section class="contents ${sidebar?'sidebar-contents':''}">${sidebar?`<div class="contents-title"><span>CONTENTS</span><button aria-label="Hide contents" data-action="hide-contents">${icon('list',17)}</button></div>`:''}
    <div class="content-modules">${modules.map((item,weekIndex)=>{
      const expanded=state.expanded.has(weekIndex);
      const kind=item.kind || 'week';
      const submitted=weekIndex<8;
      return `<div class="module-group ${expanded?'expanded':''}"><button class="module-header" data-action="toggle-module" data-week="${weekIndex}" aria-expanded="${expanded}"><span class="module-arrow">${expanded?'⌄':'›'}</span><span>${escapeHtml(item.title)}</span>${kind==='week'?`<span class="module-check ${submitted?'done':''}">${submitted?icon('check',12):''}</span>`:''}</button>
        ${expanded?`<div class="module-items">${item.lessons.map((title,lessonIndex)=>{
          const type=kind==='resource'?'Lesson':title==='Lecture Materials'?'Lesson':'Video';
          const itemIndex=kind==='week'?lessonList.findIndex(entry=>entry.weekIndex===weekIndex&&entry.index===lessonIndex):-1;
          return `<button class="lesson-row ${state.view==='lesson'&&state.selectedLesson===itemIndex?'chosen':''}" data-action="${kind==='resource'?'resource':'lesson'}" data-lesson="${itemIndex}" data-week="${weekIndex}" data-resource="${lessonIndex}"><span class="item-icon">${mediaIcon(type)}</span><span class="lesson-name">${escapeHtml(title)}<small>${type}</small></span>${kind==='week'?`<span class="lesson-status ${type==='Assignment'?'done':''}">${type==='Assignment'?icon('check',13):''}</span>`:''}</button>`;
        }).join('')}${kind==='week'?`<button class="lesson-row assignment-link" data-action="assignment" data-week="${weekIndex}"><span class="item-icon">${mediaIcon('Assignment')}</span><span class="lesson-name">${item.title}: Assignment ${weekIndex+1}<small>Assignment</small></span><span class="lesson-status done">${icon('check',13)}</span></button>`:''}</div>`:''}
      </div>`;
    }).join('')}</div></section>`;
}

function contentsPage() {
  return `<main class="page contents-page">${courseContents()}</main>`;
}

function gradesPage() {
  return `<main class="page grades-page"><section class="grade-summary"><div class="filter-tabs" role="group" aria-label="Assignment type"><button class="filter-chip ${state.gradeFilter==='All'?'selected':''}" data-action="grade-filter" data-filter="All"><b>8</b> All</button><button class="filter-chip ${state.gradeFilter==='Assessments'?'selected':''}" data-action="grade-filter" data-filter="Assessments"><b>8</b> Assessments</button></div><div class="grade-total"><div class="progress-track"><span style="width:100%"></span></div><span>8 of 8 submitted</span></div></section>
    <div class="grade-cards">${modules.slice(0,8).map((item,index)=>`<button class="grade-card" data-action="assignment" data-week="${index}"><span>${item.title}</span><span class="grade-number">1</span><div class="progress-track"><span style="width:100%"></span></div><small>Submitted</small></button>`).join('')}</div>
  </main>`;
}

function lessonView() {
  const item=lesson();
  return `<main class="lesson-layout">${courseContents({sidebar:true})}<section class="lesson-content"><div class="lesson-title-bar"><div><small>WEEK ${item.weekIndex+1}</small><h1>${escapeHtml(item.title)}</h1></div><button class="unit-progress" aria-label="Lesson status">${icon('check',15)} <span>⌄</span></button></div>
      <div class="video-frame ${state.playing?'playing':''}" role="button" tabindex="0" data-action="play-video" aria-label="Play video"><img src="https://i.ytimg.com/vi_webp/d7zeaz-NjmM/sddefault.webp" alt="${escapeHtml(item.title)}"><div class="video-shade"></div><button class="youtube-play" aria-label="Play video">${icon(state.playing?'check':'play',38)}</button>${state.playing?'<div class="video-playing-label">Video playback</div>':''}</div>
      <div class="lesson-tabs"><button class="${state.lessonTab==='Objectives'?'selected':''}" data-action="lesson-tab" data-tab="Objectives">${icon('assignment',16)} Objectives</button><button class="${state.lessonTab==='Transcript'?'selected':''}" data-action="lesson-tab" data-tab="Transcript">${icon('list',16)} Transcript</button></div>
      ${state.lessonTab==='Objectives'?`<div class="objectives"><h2>Concepts Covered :</h2><ul>${objectives.map(text=>`<li>${escapeHtml(text)}</li>`).join('')}</ul></div>`:`<div class="transcript-panel"><div class="transcript-controls"><label>Auto-scroll <button class="switch ${state.autoScroll?'on':''}" aria-label="Auto-scroll" data-action="auto-scroll"><i></i></button></label><button class="language-select" disabled>English　⌄</button></div><p>Transcript not available for the selected language.</p></div>`}
      <div class="lesson-pager"><button data-action="lesson-prev">${icon('back',17)} <span><small>PREVIOUS</small>${escapeHtml(lessonList[Math.max(0,state.selectedLesson-1)]?.title || 'Course overview')}</span></button><button data-action="lesson-next"><span><small>NEXT</small>${escapeHtml(lessonList[Math.min(lessonList.length-1,state.selectedLesson+1)]?.title || 'Course overview')}</span>${icon('arrow',17)}</button></div>
    </section>${state.openPanel==='calculator'?calculatorPanel():''}<button class="floating-calculator" aria-label="Toggle calculator" data-action="calculator">${icon('calculator',20)}</button></main>`;
}

function assignmentPage() {
  const week=state.selectedWeek;
  return `<main class="lesson-layout assignment-layout">${courseContents({sidebar:true})}<section class="lesson-content assignment-content"><h1>${modules[week].title}: Assignment ${week+1}</h1><div class="submitted-banner">${icon('check',20)}<div><strong>Assessment Submitted</strong><span>Your attempt has been successfully submitted. You may review your answers.</span></div></div>
      <section class="detail-card"><h2>${icon('assignment',18)} ASSIGNMENT DETAILS</h2><dl><div><dt>Mode</dt><dd>Graded</dd></div><div><dt>Submission</dt><dd>Multiple submissions allowed. Your most recent submission is considered</dd></div><div><dt>Total Questions</dt><dd>10</dd></div><div><dt>Minimum Required Score</dt><dd>50% <span class="score-pill">Current Score: 80%</span></dd></div><div><dt>Deadline</dt><dd>Dec 31, 2026 <b>•</b> 11:59 PM IST</dd></div></dl></section>
      <section class="detail-card submission-card"><h2>${icon('clock',18)} SUBMISSION OVERVIEW</h2><div class="submission-stats"><strong>8 / 10 <b>80%</b></strong><div><small>CORRECT</small><b>8</b></div><div><small>PARTIAL</small><b>0</b></div><div><small>INCORRECT</small><b>2</b></div><div><small>UNATTEMPTED</small><b>0</b></div></div><div class="answer-track"><i></i></div></section>
      <section class="instruction-card"><h2>INSTRUCTIONS</h2><ol>${assignmentInstructions.map(line=>`<li>${escapeHtml(line)}</li>`).join('')}</ol></section><button class="primary-button review-button" data-action="review">Review</button>
      <div class="lesson-pager"><button data-action="lesson-prev">${icon('back',17)} <span><small>PREVIOUS</small>Lecture Materials</span></button><button data-action="lesson-next"><span><small>NEXT</small>${escapeHtml(modules[week+1]?.lessons[0]||'Course overview')}</span>${icon('arrow',17)}</button></div>
    </section></main>`;
}

function reviewPage() {
  const questionIndex=state.reviewQuestion||0;
  const card=(index)=>{
    const q=reviewQuestions[index]; const options=q.options||['(a)','(b)','(c)','(d)'];
    const optionsMarkup=options.map((label,optionIndex)=>{
      const letter=String.fromCharCode(65+optionIndex); const checked=q.selected.includes(letter); const correct=q.correct.includes(letter); const expected=q.multiple&&!checked&&correct;
      const optionState=correct?'correct':checked&&!correct?'wrong':expected?'expected':'';
      return `<label class="answer-option ${optionState}"><input type="${q.multiple?'checkbox':'radio'}" name="review-${index}" ${checked?'checked':''} disabled><span class="answer-letter">${letter}.</span><span>${escapeHtml(label)}</span>${optionState?`<b class="answer-tag">${optionState==='correct'?'Correct':optionState==='expected'?'Expected':'Wrong'}</b>`:''}</label>`;
    }).join('');
    return `<section class="review-question-card" id="review-card-${index}"><div class="question-heading"><h1>Question ${index+1} / 10</h1><span>•　1 mark</span></div>${q.prompt?`<p class="question-prompt">${escapeHtml(q.prompt)}</p>`:''}<div class="answer-result ${q.result.toLowerCase().replaceAll(' ','-')}"><strong>Answer is ${q.result}</strong><span>Score: ${q.score} / 1</span></div><h2>Options</h2>${q.image&&!q.prompt?`<img class="question-image" src="${escapeHtml(q.image)}" alt="Question ${index+1}">`:''}<div class="answer-options">${optionsMarkup}</div></section>`;
  };
  return `<main class="review-page ${state.reviewLayout==='list'?'list-view':''} ${state.reviewLayout==='list'?'':'paged-view'}">
    <div class="review-top"><div class="question-strip">${reviewQuestions.map((item,index)=>`<button class="question-index ${index===questionIndex?'current':''} ${item.result==='Wrong'?'incorrect':''} ${item.result==='Partially Correct'?'partial':''}" data-action="review-question" data-question="${index}" aria-label="Question ${index+1}"><span>${index+1}</span><i>${item.result==='Wrong'?'×':item.result==='Partially Correct'?'◌':'✓'}</i></button>`).join('')}</div><div class="view-toggle"><button class="${state.reviewLayout!=='list'?'selected':''}" aria-label="Paged view" data-action="review-layout" data-layout="paged">▮</button><button class="${state.reviewLayout==='list'?'selected':''}" aria-label="List view" data-action="review-layout" data-layout="list">▤</button></div></div>
    <div class="review-cards">${state.reviewLayout==='list'?reviewQuestions.map((_,index)=>card(index)).join(''):card(questionIndex)}</div>
    ${state.reviewLayout==='list'?'':`<div class="review-pager"><button data-action="review-prev" ${questionIndex===0?'disabled':''}>${icon('back',17)} Previous</button><button data-action="review-next" ${questionIndex===reviewQuestions.length-1?'disabled':''}>Next ${icon('arrow',17)}</button></div>`}
  </main>`;
}

function resourcePage() {
  const item=modules[state.resourceWeek||8];
  const title=item?.lessons[state.resourceIndex||0] || item?.lessons[0] || 'MP4 FORMAT';
  return `<main class="page resource-page"><button class="back-text" data-action="resource-close">${icon('back',17)} Back to course contents</button><section class="resource-card"><div class="resource-mark">${icon('book',30)}</div><small>${escapeHtml(item?.title||'DOWNLOAD VIDEOS')}</small><h1>${escapeHtml(title)}</h1><p>${escapeHtml(course.title)}</p></section></main>`;
}

function calculatorPanel() {
  return `<aside class="calculator-panel"><div class="panel-title"><strong>Calculator</strong><button aria-label="Close calculator" data-action="close-panel">${icon('close',18)}</button></div><div class="calculator-display">${escapeHtml(state.calc)}</div><div class="calculator-keys">${['C','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','±','0','.','='].map(key=>`<button data-action="calc-key" data-key="${key}" class="${['÷','×','−','+','='].includes(key)?'operator':''}">${key}</button>`).join('')}</div></aside>`;
}

function drawer() {
  if(state.openPanel==='announcements'||state.openPanel==='more') return `<div class="scrim" data-action="scrim"><section class="bottom-sheet ${state.openPanel==='announcements'?'announcements-sheet':'more-sheet'}" role="dialog" aria-modal="true" aria-label="${state.openPanel==='more'?'More':'Announcements'}"><div class="sheet-grip"></div><div class="sheet-heading"><h2>${state.openPanel==='more'?'More':'Announcements'}</h2><button aria-label="Close ${state.openPanel==='more'?'More':'announcements'}" data-action="close-panel">${icon('close',20)}</button></div>${state.openPanel==='more'?`<button class="more-link" data-action="announcements">${icon('megaphone',18)} Announcements ${icon('chevron',17)}</button>`:`<div class="filter-tabs announcement-filters"><button class="filter-chip ${state.announcementFilter==='All'?'selected':''}" data-action="announcement-filter" data-filter="All">All</button><button class="filter-chip ${state.announcementFilter==='Unread'?'selected':''}" data-action="announcement-filter" data-filter="Unread">Unread</button></div><div class="empty-announcements">No announcements yet</div>`}</section></div>`;
  if(state.openPanel==='account') return `<div class="scrim" data-action="scrim"><section class="account-sheet" role="dialog" aria-modal="true" aria-label="Account"><div class="account-top"><div class="account-avatar">A</div><div><strong>Aditya Lokhande</strong><span>Course account</span></div><button aria-label="Close account" data-action="close-panel">${icon('close',20)}</button></div><div class="appearance"><h3>APPEARANCE</h3><div class="appearance-options">${[['Light','sun'],['Dark','moon'],['System','desktop']].map(([name,ico])=>`<button class="${state.theme===name?'chosen':''}" data-action="theme" data-theme="${name}">${icon(ico,17)} ${name}</button>`).join('')}</div></div><div class="account-section"><h3>ACCOUNT</h3><button data-action="account-link">▦　 Student Dashboard</button><button data-action="account-link">♙　 My Courses</button></div><div class="account-section"><h3>HELP AND POLICIES</h3><button data-action="account-link">ⓘ　 Privacy &amp; Terms</button><button data-action="account-link">◇　 Honor Code</button><button data-action="account-link">♧　 Code of Conduct</button><button data-action="account-link">?　 FAQs</button></div><button class="sign-out" data-action="sign-out">Sign out</button></section></div>`;
  if(state.openPanel==='register') return `<div class="scrim" data-action="scrim"><section class="dialog-card" role="dialog" aria-modal="true" aria-label="Register for exam"><div class="sheet-heading"><h2>Register for exam</h2><button aria-label="Close" data-action="close-panel">${icon('close',20)}</button></div><p>EXAM FEE</p><ul>${course.fees.map(text=>`<li>${escapeHtml(text)}</li>`).join('')}</ul><button class="primary-button" data-action="close-panel">Close</button></section></div>`;
  return '';
}

function render() {
  document.documentElement.dataset.theme=state.theme.toLowerCase();
  document.body.classList.toggle('dark',state.theme==='Dark');
  let page=state.view==='overview'?overview():state.view==='contents'?contentsPage():state.view==='grades'?gradesPage():state.view==='lesson'?lessonView():state.view==='review'?reviewPage():state.view==='resource'?resourcePage():assignmentPage();
  const inLesson=state.view==='lesson'||state.view==='assignment';
  app.innerHTML=`<div class="site-shell ${inLesson?'unit-shell':''} ${state.view==='review'?'review-shell':''}">${header()}${page}${inLesson||state.view==='review'?'':bottomNav()}${drawer()}</div>`;
  if(state.openPanel==='calculator'&&state.view!=='lesson') state.openPanel='';
}

function handleClick(event) {
  const button=event.target.closest('[data-action]'); if(!button)return;
  const action=button.dataset.action;
  if(action==='overview'||action==='contents'||action==='grades'){state.openPanel='';go(action);}
  else if(action==='more'){state.openPanel=state.openPanel==='more'?'':'more';render();}
  else if(action==='account'){state.openPanel=state.openPanel==='account'?'':'account';render();}
  else if(action==='announcements'){state.openPanel='announcements';render();}
  else if(action==='close-panel'){state.openPanel='';render();}
  else if(action==='scrim'&&event.target===button){state.openPanel='';render();}
  else if(action==='toggle-module'||action==='open-module'){
    const week=Number(button.dataset.week); state.openPanel='';
    if(action==='open-module')state.expanded.add(week);
    else state.expanded.has(week)?state.expanded.delete(week):state.expanded.add(week);
    if(week<8&&action==='open-module') { state.openPanel='';go('contents'); }
    else if(week>=8){state.resourceWeek=week;state.view='resource';render();}
    else render();
  }
  else if(action==='lesson'){state.openPanel='';go('lesson',button.dataset.lesson);}
  else if(action==='resource'){state.resourceWeek=Number(button.dataset.week);state.resourceIndex=Number(button.dataset.resource);state.view='resource';state.openPanel='';render();}
  else if(action==='assignment'){state.openPanel='';go('assignment',Number(button.dataset.week)+1);}
  else if(action==='grade-filter'){state.gradeFilter=button.dataset.filter;render();}
  else if(action==='announcement-filter'){state.announcementFilter=button.dataset.filter;render();}
  else if(action==='lesson-tab'){state.lessonTab=button.dataset.tab;render();}
  else if(action==='play-video'){state.playing=!state.playing;render();}
  else if(action==='continue'){go('lesson',0);}
  else if(action==='register'){state.openPanel='register';render();}
  else if(action==='calculator'){state.openPanel=state.openPanel==='calculator'?'':'calculator';render();}
  else if(action==='auto-scroll'){state.autoScroll=!state.autoScroll;render();}
  else if(action==='transcript-language'){state.openPanel='language';render();}
  else if(action==='hide-contents'){document.querySelector('.lesson-layout')?.classList.toggle('contents-hidden');}
  else if(action==='lesson-next'){state.selectedLesson=Math.min(lessonList.length-1,state.selectedLesson+1);state.lessonTab='Objectives';state.playing=false;go('lesson',state.selectedLesson);}
  else if(action==='lesson-prev'){state.selectedLesson=Math.max(0,state.selectedLesson-1);state.lessonTab='Objectives';state.playing=false;go('lesson',state.selectedLesson);}
  else if(action==='review'){state.view='review';state.reviewQuestion=0;state.reviewLayout='paged';render();window.scrollTo(0,0);}
  else if(action==='review-question'){state.reviewQuestion=Number(button.dataset.question);render();if(state.reviewLayout==='list')requestAnimationFrame(()=>document.getElementById(`review-card-${state.reviewQuestion}`)?.scrollIntoView({behavior:'smooth',block:'start'}));}
  else if(action==='review-layout'){state.reviewLayout=button.dataset.layout;render();}
  else if(action==='review-next'){state.reviewQuestion=Math.min(reviewQuestions.length-1,(state.reviewQuestion||0)+1);render();}
  else if(action==='review-prev'){state.reviewQuestion=Math.max(0,(state.reviewQuestion||0)-1);render();}
  else if(action==='assignment-back'){go('assignment',state.selectedWeek+1);}
  else if(action==='theme'){state.theme=button.dataset.theme;localStorage.setItem('nptel-theme',state.theme);render();}
  else if(action==='account-link'){state.openPanel='';render();}
  else if(action==='sign-out'){
    state.openPanel='';
    location.href='/login/';
  }
  else if(action==='calc-key'){calcKey(button.dataset.key);render();}
  else if(action==='resource-close'){go('contents');}
}

function calcKey(key){
  if(key==='C'){state.calc='0';state.calcFresh=true;return;}
  if(key==='⌫'){state.calc=state.calc.length>1?state.calc.slice(0,-1):'0';return;}
  if(key==='±'){state.calc=String(Number(state.calc)*-1);return;}
  if(key==='='){
    try{const expression=state.calc.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/[^0-9.+*/%() -]/g,'');state.calc=String(Function(`"use strict"; return (${expression})`)());}catch{state.calc='Error';}state.calcFresh=true;return;
  }
  if(state.calcFresh&&/\d|\./.test(key)){state.calc=key;state.calcFresh=false;return;}
  state.calc=state.calc==='0'&&/\d/.test(key)?key:state.calc+key;state.calcFresh=false;
}

app.addEventListener('click',handleClick);
window.addEventListener('popstate',routeFromHash);
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.openPanel){state.openPanel='';render();}if((event.key==='Enter'||event.key===' ')&&event.target.matches('.video-frame')){event.preventDefault();state.playing=!state.playing;render();}});
routeFromHash();
