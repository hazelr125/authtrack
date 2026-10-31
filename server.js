const express = require('express'), fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, 'data.json');
const day = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

function seed() {
  const payers = ['Aetna', 'UnitedHealthcare', 'Cigna', 'Blue Cross', 'Medicare Adv.'];
  const procs = ['MRI Lumbar Spine', 'Physical Therapy x12', 'CT Abdomen', 'Sleep Study', 'Knee Arthroscopy', 'Biologic Rx'];
  const st = ['Approved', 'Pending', 'Denied', 'Appeal', 'Approved', 'Pending'];
  const rows = Array.from({ length: 14 }, (_, i) => ({
    id: 'PA-' + (1001 + i), alias: 'Case ' + String.fromCharCode(65 + i),
    payer: payers[i % 5], procedure: procs[i % 6], status: st[i % 6],
    submitted: day(-(i * 14 + 2)), due: day(i % 6 === 1 ? i - 3 : -i), notes: ''
  }));
  fs.writeFileSync(FILE, JSON.stringify(rows, null, 2));
  return rows;
}
const load = () => fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : seed();
const save = d => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/requests', (_, res) => res.json(load()));
app.post('/api/requests', (req, res) => {
  const d = load();
  const n = d.reduce((m, r) => Math.max(m, +r.id.split('-')[1]), 1000) + 1;
  const r = { ...req.body, id: 'PA-' + n };
  d.push(r); save(d); res.status(201).json(r);
});
app.put('/api/requests/:id', (req, res) => {
  const d = load(), i = d.findIndex(r => r.id === req.params.id);
  if (i < 0) return res.sendStatus(404);
  d[i] = { ...d[i], ...req.body, id: d[i].id }; save(d); res.json(d[i]);
});
app.delete('/api/requests/:id', (req, res) => {
  save(load().filter(r => r.id !== req.params.id)); res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('AuthTrack running at http://localhost:' + PORT));
