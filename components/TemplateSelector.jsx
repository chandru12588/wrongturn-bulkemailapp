import emailTemplates from "../templates/emailTemplates";

export default function TemplateSelector({ onSelect }) {
  return (
    <div>
      <h4>Select Email Template</h4>
      {emailTemplates.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => onSelect(tpl)}
          style={{ marginRight: 10 }}
        >
          {tpl.name}
        </button>
      ))}
    </div>
  );
}
