const pages = {
  dashboard: {title:'Good morning, Admin ✦', subtitle:"Here's what's happening at your fitness center today."},
  members: {title:'Members', subtitle:'Manage member profiles, memberships and progress.', description:'Your fitness community and membership records.'},
  trainers: {title:'Trainers', subtitle:'Manage your coaching team and trainer allocation.', description:'Trainer profiles, specialties and availability.'},
  classes: {title:'Class schedule', subtitle:'Plan sessions and keep your classes organized.', description:'Upcoming group classes and session capacity.'},
  programs: {title:'Workout programs', subtitle:'Create and manage member workout plans.', description:'Programs designed to help members reach their goals.'},
  attendance: {title:'Attendance', subtitle:'Track member check-ins and daily activity.', description:'Recent attendance records and check-in status.'}
};
const sample = {
  trainers:[['Priya Sharma','Yoga · 5 years','Available'],['Arjun Mehta','Strength training · 7 years','In session'],['Riya Kapoor','HIIT · 4 years','Available'],['Neha Singh','Zumba · 3 years','Available']],
  classes:[['Morning Yoga','07:00 AM · Studio A','18 / 20 spots'],['Strength Training','09:30 AM · Gym Floor','12 / 15 spots'],['HIIT Workout','05:00 PM · Studio B','16 / 20 spots'],['Zumba','06:30 PM · Studio A','22 / 25 spots']],
  programs:[['Beginner Fitness','4-week full body plan','32 members'],['Strength Builder','8-week strength plan','18 members'],['Cardio Boost','6-week endurance plan','24 members']],
  attendance:[['Aditya Kumar','Today · 07:12 AM','Checked in'],['Simran Malhotra','Today · 07:25 AM','Checked in'],['Rahul Verma','Yesterday · 06:40 PM','Checked out'],['Ananya Das','Yesterday · 08:05 AM','Checked in']]
};
let members = [
  ['Aditya Kumar','aditya.k@email.com','Premium','21 Nov, 2026','Active'],
  ['Simran Malhotra','simran.m@email.com','Standard','20 Nov, 2026','Active'],
  ['Rahul Verma','rahul.v@email.com','Basic','19 Nov, 2026','Pending'],
  ['Ananya Das','ananya.d@email.com','Premium','18 Nov, 2026','Active']
];
const $ = id => document.getElementById(id);
const toast = message => { $('toast').textContent=message; $('toast').classList.add('show'); setTimeout(()=>$('toast').classList.remove('show'),2400); };
$('today').textContent = new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
function renderMembers(){
  $('memberCount').textContent=(1248+Math.max(0,members.length-4)).toLocaleString('en-IN');
  $('recentMembers').innerHTML=members.slice(0,4).map((m,i)=>`<tr><td><div class="person"><span class="person-avatar ${['pink','yellow','blue-bg'][i%3]}">${m[0].split(' ').map(x=>x[0]).join('').slice(0,2)}</span><span><strong>${escapeHTML(m[0])}</strong><small>${escapeHTML(m[1])}</small></span></div></td><td>${escapeHTML(m[2])}</td><td>${m[3]}</td><td><span class="status ${m[4]==='Active'?'active-status':'pending-status'}">${m[4]}</span></td></tr>`).join('');
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showPage(page){
  const data=pages[page]||pages.dashboard;
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  $('crumb').textContent=page==='dashboard'?'Dashboard':data.title;
  $('pageTitle').textContent=data.title;
  $('pageSubtitle').textContent=data.subtitle;
  $('dashboardPage').classList.toggle('hidden',page!=='dashboard');
  $('genericPage').classList.toggle('hidden',page==='dashboard');
  $('addButton').textContent=page==='members'?'＋ Add member':'＋ '+(page==='classes'?'Add class':'Add '+(page==='dashboard'?'member':page.slice(0,-1)));
  if(page!=='dashboard'){
    $('genericTitle').textContent=data.title;
    $('genericDescription').textContent=data.description;
    $('searchInput').value='';
    renderGeneric(page);
  }
  $('sidebar').classList.remove('open');
}
function renderGeneric(page,filter=''){
  const rows=page==='members'?members.map(m=>[m[0],m[1]+' · '+m[2]+' membership',m[4]]):(sample[page]||[]);
  const filtered=rows.filter(row=>row.join(' ').toLowerCase().includes(filter.toLowerCase()));
  $('genericBody').innerHTML=filtered.length?filtered.map(row=>`<div class="generic-row"><div><strong>${escapeHTML(row[0])}</strong><small>${escapeHTML(row[1])}</small></div><span class="tag">${escapeHTML(row[2])}</span></div>`).join(''):'<p class="empty-note">No matching records found.</p>';
}
document.querySelectorAll('.nav-link').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));
$('mobileMenu').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('searchInput').addEventListener('input',e=>{const page=document.querySelector('.nav-link.active')?.dataset.page||'members';renderGeneric(page,e.target.value);});
$('addButton').addEventListener('click',()=>{
  const page=document.querySelector('.nav-link.active')?.dataset.page||'dashboard';
  if(page==='members'||page==='dashboard'){$('memberDialog').showModal();}
  else toast('Demo mode: '+pages[page].title+' can be managed here.');
});
$('memberForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('newName').value.trim(),email=$('newEmail').value.trim(),plan=$('newPlan').value;
  if(!name||!email)return;
  members.unshift([name,email,plan,new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),'Active']);
  renderMembers();
  if(! $('genericPage').classList.contains('hidden'))renderGeneric('members',$('searchInput').value);
  $('memberDialog').close();$('memberForm').reset();toast(name+' added successfully!');
});
$('periodSelect').addEventListener('change',e=>{
  const heights=e.target.value==='Last week'?[35,54,72,48,62,82,29]:e.target.value==='This month'?[58,77,65,91,78,100,47]:[48,68,57,88,73,96,38];
  $('chartBars').querySelectorAll('div').forEach((bar,i)=>bar.style.height=heights[i]+'%');
});
renderMembers();
