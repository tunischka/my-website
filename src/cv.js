(async function () {
  const res = await fetch('data/cv.json', { cache: 'no-store' });
  if (!res.ok) return console.error('cv.json bulunamadı');
  const cv = await res.json();

  const byId = id => document.getElementById(id);

  // Summary
  if (cv.summary) byId('cv-summary').textContent = cv.summary;

  // Experience
  if (Array.isArray(cv.experience)) {
    const ul = byId('cv-experience');
    cv.experience.forEach(item => {
      const li = document.createElement('li');
      const title = document.createElement('div');
      title.className = 'cv-role'; // mevcut CSS sınıflarınla eşle
      title.textContent = item.title_line || '';
      li.appendChild(title);

      if (Array.isArray(item.highlights)) {
        const sub = document.createElement('ul');
        item.highlights.forEach(h => {
          const s = document.createElement('li');
          s.textContent = h;
          sub.appendChild(s);
        });
        li.appendChild(sub);
      }
      ul.appendChild(li);
    });
  }

  // Education
  if (Array.isArray(cv.education)) {
    const ul = byId('cv-education');
    cv.education.forEach(e => {
      const li = document.createElement('li');
      li.textContent = e;
      ul.appendChild(li);
    });
  }

  // Projects
  if (Array.isArray(cv.projects)) {
    const ul = byId('cv-projects');
    cv.projects.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      ul.appendChild(li);
    });
  }

  // Skills
  if (Array.isArray(cv.skills)) {
    const ul = byId('cv-skills');
    cv.skills.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      ul.appendChild(li);
    });
  }

  // Certs
  if (Array.isArray(cv.certifications)) {
    const ul = byId('cv-certs');
    cv.certifications.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      ul.appendChild(li);
    });
  }

  // Languages
  if (Array.isArray(cv.languages)) {
    const ul = byId('cv-languages');
    cv.languages.forEach(l => {
      const li = document.createElement('li');
      li.textContent = l;
      ul.appendChild(li);
    });
  }
})();
