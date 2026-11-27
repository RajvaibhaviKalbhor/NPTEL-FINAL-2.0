export const course = {
  title: 'Evolution of Air Interface towards 5G',
  instructor: 'Prof. Suvra Sekhar Das',
  certificate: 'E-Certificate',
  enrolledOn: 'Nov 17, 2026',
  accessUntil: 'Nov 16, 2027',
  progress: 100,
  assignmentsSubmitted: 8,
  criteria: [
    'Assignment score =Score more than 50% in at least 6/8 assignments.',
    'Exam score = 50% of the proctored certification exam score out of 100',
    'Only the e-certificate will be made available. Hard copies will not be dispatched.'
  ],
  fees: [
    'The fee for remote proctoring exam is Rs.1500 + GST.',
    'An additional fee of Rs.1500 will apply for a non-standard time slot.'
  ]
};

export const modules = [
  { title: 'Week 1', lessons: [
    'Lecture 01: Evolution of wireless communication',
    'Lecture 02: Evolution of wireless communication standards from 2G to 5G',
    'Lecture 03: Evolution of wireless communication standards from 2G to 5G ( Contd. )',
    'Lecture 04: Evolution of wireless communication standards from 2G to 5G ( Contd. )',
    'Lecture 05: Evolution of wireless communication standards from 2G to 5G ( Contd. )', 'Lecture Materials'
  ]},
  { title: 'Week 2', lessons: [
    'Lecture 06 : Requirements and operating scenarios of 5G', 'Lecture 07 : Requirements and operating scenarios of 5G (contd.)',
    'Lecture 08 : 5G scenarios', 'Lecture 09 : Ultra reliable low latency communication', 'Lecture 10 : Designing 5G new radio', 'Lecture Materials'
  ]},
  { title: 'Week 3', lessons: [
    'Lecture 11 : Fundamental Framework for waveform analysis', 'Lecture 12 : Fundamental Framework for waveform analysis (cont.)',
    'Lecture 13 : Waveform Design Aspects of 2G', 'Lecture 14 : Waveforms in 3G', 'Lecture 15 : Waveforms in 3G (cont.)', 'Lecture Materials'
  ]},
  { title: 'Week 4', lessons: [
    'Lecture 16 : Waveform in 4G and 5G (OFDM)', 'Lecture 17 : Waveform in 4G and 5G (OFDM) contd.',
    'Lecture 18 : Waveform in 4G and 5G (OFDM) contd.', 'Lecture 19 : Waveform in 4G and 5G (OFDMA)',
    'Lecture 20 : Waveform in 4G and 5G (OFDMA, SCFDMA, SCFDE )', 'Lecture Materials'
  ]},
  { title: 'Week 5', lessons: [
    'Lecture 21 : Waveform in 4G and 5G (SCFDMA cont.)', 'Lecture 22 : Waveform in 5G', 'Lecture 23 : Waveform in 5G Numerology',
    'Lecture 24 : Frame Structure in 5G NR', 'Lecture 25 : Numerology in 5G and adaptive subcarrier bandwidth', 'Lecture Materials'
  ]},
  { title: 'Week 6', lessons: [
    'Lecture 26 : Numerology in 5G (cont.)', 'Lecture 27 : Waveforms beyond 5G', 'Lecture 28 : Waveforms beyond 5G (cont.)',
    'Lecture 29 : Waveforms beyond 5G (cont.)', 'Lecture 30 : Waveforms beyond 5G (cont.)', 'Lecture Materials'
  ]},
  { title: 'Week 7', lessons: [
    'Lecture 31 : Waveform beyond 5G (Precoded GFDM)', 'Lecture 32 : Comparison of waveforms',
    'Lecture 33 : Channel models for performance evaluation (Part I)', 'Lecture 34 : Channel models for performance evaluation (Part II)',
    'Lecture 35 : Channel models for performance evaluation (Part III)', 'Lecture Materials'
  ]},
  { title: 'Week 8', lessons: [
    'Lecture 36 : MIMO Signal Processing (Receive Diversity)', 'Lecture 37 : MIMO Signal Processing (Transmit Diversity)',
    'Lecture 38 : MIMO Signal Processing (Capacity)', 'Lecture 39 : MIMO Signal Processing (Capacity & Massive MIMO)',
    'Lecture 40 : Hybrid beamforming (mmWave)', 'Lecture 41 : NOMA', 'Lecture Materials'
  ]},
  { title: 'DOWNLOAD VIDEOS', kind: 'resource', lessons: ['MP4 FORMAT'] },
  { title: 'Text Transcripts', kind: 'resource', lessons: ['English Transcripts'] },
  { title: 'Books', kind: 'resource', lessons: ['English Book'] }
];

export const objectives = [
  'Basic Ground work and prerequisites',
  'Course arrangements',
  'Historical perspective of wireless communication'
];

export const assignmentInstructions = [
  'Read each question carefully. For questions that allow a single selection, choose the best option; for questions that allow multiple selections, select all options that apply.',
  'Flag questions with the flag icon to review and return to them later.',
  'Your progress is saved automatically as you move between questions.',
  'For assessments that allow only one submission, review your answers before submitting.',
  'For assessments that allow multiple submissions, only your latest submission is considered.'
];

export const reviewQuestions = [
  { prompt: 'Among the following, which is NOT a metric indicating “Quality of service” in a wireless mobile standard?', options: ['Blocking probability','Cutoff probability','Percentage of users in cell edge','Initial connection delay'], selected: ['C'], correct: ['C'], result: 'Correct', score: '1' },
  { image: 'https://onlinecourses-archive.nptel.ac.in/noc19_ee16/assets/img/a1q7.JPG', selected: ['C'], correct: ['C'], result: 'Correct', score: '1' },
  { image: 'https://onlinecourses-archive.nptel.ac.in/noc19_ee16/assets/img/a1q9.JPG', selected: ['B'], correct: ['B'], result: 'Correct', score: '1' },
  { image: 'https://onlinecourses-archive.nptel.ac.in/noc19_ee16/assets/img/a1q12.JPG', selected: ['C'], correct: ['C'], result: 'Correct', score: '1' },
  { image: 'https://storage.googleapis.com/swayam-node1-production.appspot.com/assets/img/noc20_ee36/w1q3.JPG', selected: ['A','B','C'], correct: ['A','B'], result: 'Wrong', score: '0', multiple: true },
  { image: 'https://storage.googleapis.com/swayam-node1-production.appspot.com/assets/img/noc21_ee12/w1q3.png', selected: ['A'], correct: ['A'], result: 'Correct', score: '1' },
  { image: 'https://storage.googleapis.com/swayam-node1-production.appspot.com/assets/img/noc21_ee12/w1q5.png', selected: ['D'], correct: ['D'], result: 'Correct', score: '1' },
  { image: 'https://storage.googleapis.com/swayam-node1-production.appspot.com/assets/img/noc21_ee12/w1q6.png', selected: ['C'], correct: ['C'], result: 'Correct', score: '1' },
  { image: 'https://storage.googleapis.com/swayam-node1-production.appspot.com/assets/img/noc21_ee12/w1q10.png', selected: ['D'], correct: ['D'], result: 'Correct', score: '1' },
  { prompt: 'Among the following, which technologies will be potentially used to realize the huge demand of throughput and high-quality services specified in 5G?', options: ['Use of GMSK','Reduction in cell size','Use of Massive MIMO','All of the above'], image: 'https://storage.googleapis.com/swayam-node1-production.appspot.com/assets/img/noc21_ee12/w1q12.png', selected: ['C'], correct: ['B','C'], result: 'Partially Correct', score: '0.5', multiple: true }
];

export const icon = (name, size = 20) => {
  const paths = {
    home: '<path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5h-5v-6h-7v6h-5a.5.5 0 0 1-.5-.5z"/>',
    list: '<path d="M4 6h2v2H4zm4 0h12v2H8zM4 11h2v2H4zm4 0h12v2H8zM4 16h2v2H4zm4 0h12v2H8z"/>',
    chart: '<path d="M3 13h5v8H3zm7-10h5v18h-5zm7 5h5v13h-5z"/>',
    grid: '<path d="M3 3h5v5H3zm7 0h5v5h-5zm7 0h5v5h-5zM3 10h5v5H3zm7 0h5v5h-5zm7 0h5v5h-5zM3 17h5v5H3zm7 0h5v5h-5zm7 0h5v5h-5z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    back: '<path d="M19 12H5m7 7-7-7 7-7"/>',
    play: '<path d="m8 5 11 7-11 7z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    certificate: '<path d="M12 3 9.8 5l-3-.1-.8 3-2 2.2 1.2 2.7-.5 3 2.7 1.2 1.5 2.6 2.9-.7 2.9.7 1.5-2.6 2.7-1.2-.5-3 1.2-2.7-2-2.2-.8-3-3 .1z"/><path d="m9 12 2 2 4-4"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 4.5v17M8 6h8"/>',
    video: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 8 6 4-6 4z"/>',
    assignment: '<path d="M8 4h11v17H5V4h3zm0 0V2h6v2M8 10h8M8 14h8M8 18h5"/>',
    megaphone: '<path d="m3 10 14-5v14L3 14zM7 15l2 6h4l-2-6M17 9a4 4 0 0 1 0 6"/>',
    calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8v4H8zm0 8h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z"/>',
    desktop: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4"/>',
    flag: '<path d="M5 21V4m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
};
