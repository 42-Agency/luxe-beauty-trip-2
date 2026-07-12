export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name, marketing_consent, source } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  const ML_TOKEN = process.env.MAILERLITE_API_KEY;
  if (!ML_TOKEN) return res.status(500).json({ error: 'MailerLite not configured' });

  // November waitlist sources go into both groups; everything else into All Leads only
  const novemberSources = ['Seoul Group Trip Page — November Waitlist', 'November Campaign Landing Page'];
  const allLeadsGroupId = '192824971821581963';
  const novemberGroupId = '192824972174952093';

  const groups = novemberSources.includes(source)
    ? [allLeadsGroupId, novemberGroupId]
    : [allLeadsGroupId];

  const payload = {
    email,
    fields: {
      name: name || '',
      marketing_consent: marketing_consent || '',
      lead_source: source || '',
    },
    groups,
    status: 'active',
  };

  try {
    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ML_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await mlRes.json();
    if (!mlRes.ok) return res.status(mlRes.status).json(data);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
