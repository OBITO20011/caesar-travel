import { createFileRoute, Link } from "@tanstack/react-router";
import { withAdminAuth } from "@/components/admin/admin-auth";

export const Route = createFileRoute("/admin/")({
  component: withAdminAuth(AdminHome),
});

function AdminHome() {
  const cards = [
    {
      title: "✈️ الرحلات",
      link: "/admin/trips",
    },
    {
      title: "🕋 العمرة",
      link: "/admin/umrah",
    },
    {
      title: "🖼️ معرض الصور",
      link: "/admin/gallery",
    },
    {
      title: "⚙️ الإعدادات",
      link: "/admin/settings",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 40,
        fontFamily: "Tajawal",
      }}
    >
      <h1>إدارة محتوى Caesar Travel</h1>

      <p>اختر القسم الذي تريد إدارته.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 20,
          marginTop: 40,
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.link}
            to={card.link}
            style={{
              background: "white",
              padding: 25,
              borderRadius: 12,
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 5px 15px rgba(0,0,0,.08)",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {card.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
