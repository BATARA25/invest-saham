import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("display_name,role,onboarding_status,kyc_status,created_at").eq("id",user.id).maybeSingle();
  const { data: account } = await supabase.from("accounts").select("id,account_type,status,base_currency,created_at").eq("user_id",user.id).maybeSingle();
  return <main className="page">
    <Link href="/dashboard">← Dashboard</Link>
    <div className="pagehead"><div className="eyebrow">REAL USER ACCOUNT</div><h1>Account</h1><p>Account dan data pengguna tersimpan di production database INVEST+.</p></div>
    <section className="cards">
      <article><h2>Identity</h2><p>Email: <b>{user.email}</b></p><p>User ID: <small>{user.id}</small></p><p>Role: <b>{profile?.role || "user"}</b></p></article>
      <article><h2>Onboarding</h2><p>Status: <b>{profile?.onboarding_status || "pending"}</b></p><p>KYC: <b>{profile?.kyc_status || "not_started"}</b></p><p className="muted">KYC provider dan regulated onboarding belum diaktifkan.</p></article>
      <article><h2>Investment account</h2><p>Type: <b>{account?.account_type || "individual"}</b></p><p>Status: <b className="positive">{account?.status || "active"}</b></p><p>Currency: <b>{account?.base_currency || "IDR"}</b></p></article>
    </section>
    <section className="cards">
      <article><h2>Funding</h2><p>Ajukan deposit atau withdrawal request. Settlement hanya dilakukan melalui provider/entitas berizin setelah compliance live.</p><Link className="btn primary" href="/funding">Open funding →</Link></article>
      <article><h2>Orders</h2><p>Order intent tersimpan per user dan siap dihubungkan ke broker/execution venue berizin.</p><Link className="btn secondary" href="/orders">Open orders →</Link></article>
    </section>
  </main>;
}