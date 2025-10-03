// Interactive script for doctors grid and appointment booking
const doctors = [
  { id: 'd1', name: 'Dr. Rashi Jain', specialty: 'General Physician', color: '#f97316' },
  { id: 'd2', name: 'Dr. Sachin Mehta', specialty: 'Cardiologist', color: '#06b6d4' },
  { id: 'd3', name: 'Dr. Neha Shah', specialty: 'Pediatrics', color: '#8b5cf6' },
  { id: 'd4', name: 'Dr. Amit Varma', specialty: 'Dermatology', color: '#10b981' },
];

function initials(name){
  if(!name) return '';
  const parts = name.replace(/^Dr\.\s*/,'').split(' ');
  return (parts[0][0] || '') + (parts[1]? parts[1][0] : '');
}

function renderDoctors(){
  const grid = document.getElementById('doctorsGrid');
  grid.innerHTML = '';
  doctors.forEach(d => {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="avatar" style="background:${d.color}">${initials(d.name)}</div>
      <div class="meta">
        <h3>${d.name}</h3>
        <p>${d.specialty}</p>
      </div>
      <div class="card-actions">
        <button class="btn" data-id="${d.id}" aria-label="More about ${d.name}">Details</button>
        <button class="btn primary" data-id="${d.id}" aria-label="Book with ${d.name}">Book</button>
      </div>
    `;

    // Attach event listeners for quick interactions
    card.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.getAttribute('data-id');
        if(e.currentTarget.classList.contains('primary')){
          prefillAndFocus(id);
        } else {
          showDetails(id);
        }
      });
    });

    grid.appendChild(card);
  });
}

function populateDoctorSelect(){
  const select = document.getElementById('doctor');
  // keep existing first option
  doctors.forEach(d=>{
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} — ${d.specialty}`;
    select.appendChild(opt);
  });
}

function showDetails(id){
  const d = doctors.find(x=>x.id===id);
  if(!d) return;
  alert(`${d.name}\n${d.specialty}`);
}

function prefillAndFocus(id){
  const d = doctors.find(x=>x.id===id);
  if(!d) return;
  const select = document.getElementById('doctor');
  select.value = d.id;
  // focus the date field so user continues the flow
  const date = document.getElementById('date');
  date.focus();
  // smooth scroll to form
  document.getElementById('appointment-form').scrollIntoView({behavior:'smooth', block:'center'});
}

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleForm(){
  const form = document.getElementById('bookingForm');
  const msg = document.getElementById('message');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    msg.classList.add('hidden');
    const fd = new FormData(form);
    const payload = {
      name: (fd.get('name')||'').trim(),
      email: (fd.get('email')||'').trim(),
      doctorId: fd.get('doctor'),
      date: fd.get('date'),
      time: fd.get('time')
    };

    // Basic validation
    if(!payload.name){ return showMessage('Please enter your full name.','crimson'); }
    if(!payload.email || !validateEmail(payload.email)){ return showMessage('Please enter a valid email address.','crimson'); }
    if(!payload.doctorId){ return showMessage('Please select a doctor.','crimson'); }
    if(!payload.date){ return showMessage('Please choose a date.','crimson'); }
    if(!payload.time){ return showMessage('Please choose a time.','crimson'); }

    const doctor = doctors.find(d=>d.id===payload.doctorId);
    // Demo: pretend to send to server and show success
    showMessage(`Appointment requested for ${payload.name} with ${doctor.name} on ${payload.date} at ${payload.time}.`, 'green');
    form.reset();
    // reset select placeholder
    const sel = document.getElementById('doctor');
    sel.selectedIndex = 0;
  });

  function showMessage(text, color){
    msg.textContent = text;
    msg.style.color = color;
    msg.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  // Wrap content to match CSS wrapper
  const body = document.querySelector('body');
  const main = document.querySelector('main');
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  body.insertBefore(wrapper, main);
  wrapper.appendChild(main);

  renderDoctors();
  populateDoctorSelect();
  handleForm();
});
