function ContactLine({ label, value, href }) {
  if (!value) return null;
  return (
    <div className="contactLine">
      <div className="contactLabel">{label}</div>
      <div className="contactValue">
        {href ? (
          <a className="link" href={href} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export default function ContactSection({ contact }) {
  if (!contact) return <p>No contact info yet.</p>;

  return (
    <div className="contact">
      <ContactLine
        label="Email"
        value={contact.email}
        href={contact.email ? `mailto:${contact.email}` : undefined}
      />
      <ContactLine
        label="GitHub"
        value={contact.github_url}
        href={contact.github_url}
      />
      <ContactLine
        label="LinkedIn"
        value={contact.linkedin_url}
        href={contact.linkedin_url}
      />
      <ContactLine label="Location" value={contact.location} />
      <ContactLine label="Phone" value={contact.phone} />
    </div>
  );
}

