import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/visa/")({
  component: VisaPage,
});

function VisaPage() {
  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Tajawal",
      }}
    >
      <h1>📄 إدارة التأشيرات</h1>

      <button
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ➕ إضافة تأشيرة
      </button>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>الدولة</th>
            <th>السعر</th>
            <th>المدة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>السعودية</td>
            <td>120</td>
            <td>يوم</td>
            <td>✏️ 🗑️</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}