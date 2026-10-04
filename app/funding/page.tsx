"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type Request={id:string;direction:string;amount:number;currency:string;method:string;status:string;created_at:string};

export default function FundingPage(){
 const [accountId,setAccountId]=useState(""); const [items,setItems]=useState<Request[]>([]); const [direction,setDirection]=useState("deposit"); const [amount,setAmount]=useState(""); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(true);
 async function load(){const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){setLoading(false);return}const {data:a}=await s.from("accounts").select("id").eq("user_id",user.id).maybeSingle();if(!a){setMessage("Investment account belum tersedia.");setLoading(false);return}setAccountId(a.id);const {data:r}=await s.from("funding_requests").select("id,direction,amount,currency,method,status,created_at").eq("account_id",a.id).order("created_at",{ascending:false}).limit(20);setItems((r||[]) as Request[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 async function submit(e:React.FormEvent){e.preventDefault();setMessage("");const n=Number(amount);if(!Number.isFinite(n)||n<=0){setMessage("Nominal tidak valid.");return}const s=createClient();const r=await s.from("funding_requests").insert({account_id:accountId,direction,amount:n,currency:"IDR",method:"bank_transfer",status:"pending"});if(r.error){setMessage("Request gagal disimpan.");return}setAmount("");setMessage("Request tersimpan dan menunggu compliance/provider settlement.");await load()}
 if(loading)return <main className="page"><h1>Funding</h1><p>Loading…</p></main>;
 return <main className="page"><Link href="/account">← Account</Link><div className="pagehead"><div className="eyebrow">FUNDING WORKFLOW</div><h1>Deposit &amp; withdrawal requests</h1><p>Ini adalah workflow request nyata di database. Belum ada custody atau settlement dana di aplikasi.</p></div>
 <section className="cards"><article><h2>New request</h2><form onSubmit={submit}><select className="searchbox" value={direction} onChange={e=>setDirection(e.target.value)}><option value="deposit">Deposit</option><option value="withdrawal">Withdrawal</option></select><input className="searchbox" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount IDR"/><button className="btn primary">Submit request</button></form>{message&&<p>{message}</p>}</article>
 <article><h2>Request history</h2>{items.length?items.map(x=><div className="row" key={x.id}><div><b>{x.direction.toUpperCase()}</b><div className="company">{new Date(x.created_at).toLocaleString("id-ID")}</div></div><strong>Rp {Number(x.amount).toLocaleString("id-ID")}</strong><span>{x.status}</span></div>):<p>No requests yet.</p>}</article></section></main>;
}