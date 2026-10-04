"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { stocks } from "../../lib/market-data";

type Order={id:string;symbol:string;side:string;quantity:number;limit_price:number|null;status:string;created_at:string};

export default function OrdersPage(){
 const [accountId,setAccountId]=useState("");const [orders,setOrders]=useState<Order[]>([]);const [symbol,setSymbol]=useState("BBCA");const [side,setSide]=useState("buy");const [quantity,setQuantity]=useState("1");const [price,setPrice]=useState("9875");const [message,setMessage]=useState("");
 async function load(){const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)return;const {data:a}=await s.from("accounts").select("id").eq("user_id",user.id).maybeSingle();if(!a){setMessage("Investment account belum tersedia.");return}setAccountId(a.id);const {data:o}=await s.from("investment_orders").select("id,symbol,side,quantity,limit_price,status,created_at").eq("account_id",a.id).order("created_at",{ascending:false}).limit(30);setOrders((o||[]) as Order[])}
 useEffect(()=>{load()},[]);
 async function submit(e:FormEvent){e.preventDefault();setMessage("");const q=Number(quantity),p=Number(price);if(!Number.isFinite(q)||q<=0||q>100000000||!Number.isFinite(p)||p<=0){setMessage("Quantity/price tidak valid.");return}const s=createClient();const r=await s.from("investment_orders").insert({account_id:accountId,symbol,side,quantity:q,limit_price:p,status:"pending"});if(r.error){setMessage("Order intent gagal disimpan.");return}setMessage("Order intent tersimpan. Execution venue belum terhubung.");await load()}
 return <main className="page"><Link href="/account">← Account</Link><div className="pagehead"><div className="eyebrow">ORDER WORKFLOW</div><h1>Investment orders</h1><p>Order intent tersimpan secara real untuk user. Execution ke broker/venue hanya setelah integration dan compliance live.</p></div>
 <section className="cards"><article><h2>New order</h2><form onSubmit={submit}><select className="searchbox" value={symbol} onChange={e=>{setSymbol(e.target.value);setPrice(String(stocks.find(s=>s.symbol===e.target.value)?.price||0))}}>{stocks.map(s=><option key={s.symbol}>{s.symbol}</option>)}</select><select className="searchbox" value={side} onChange={e=>setSide(e.target.value)}><option value="buy">Buy</option><option value="sell">Sell</option></select><input className="searchbox" inputMode="decimal" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Quantity"/><input className="searchbox" inputMode="decimal" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Limit price"/><button className="btn primary">Create order</button></form>{message&&<p>{message}</p>}</article>
 <article><h2>Orders</h2>{orders.length?orders.map(o=><div className="row" key={o.id}><div><b>{o.side.toUpperCase()} {o.symbol}</b><div className="company">{o.quantity} shares · {new Date(o.created_at).toLocaleString("id-ID")}</div></div><strong>Rp {Number(o.limit_price||0).toLocaleString("id-ID")}</strong><span>{o.status}</span></div>):<p>No orders yet.</p>}</article></section></main>;
}