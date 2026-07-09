import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const cards = [
    {
      title: "📊 لوحة التحكم",
      link: "/admin/dashboard",
    },
    {
      title: "🛂 التأشيرات",
      link: "/admin/visa",
    },
    {
      title: "✈️ الرحلات",
      link: "/admin/trips",
    },
    {
      title: "🏨 الفنادق",
      link: "/admin/hotels",
    },
    {
      title: "🕋 العمرة",
      link: "/admin/umrah",
    },
    {
      title: "📦 الطلبات",
      link: "/admin/orders",
    },
    {
      title: "👥 المستخدمون",
      link: "/admin/users",
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
      <h1>لوحة إدارة Caesar Travel</h1>

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