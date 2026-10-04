import {NextResponse} from "next/server";
export async function GET(){return NextResponse.json({ok:true,service:"invest+",environment:process.env.NODE_ENV,marketData:"demo",timestamp:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}})}
