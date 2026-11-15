import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity, ArrowUpRight, Check, ChevronDown, ChevronRight, FileText, Filter, Globe2,
  Inbox, LayoutDashboard, LogOut, Mail, Menu, Plus, RefreshCw, Search, ShieldCheck,
  Sparkles, X, Save, Pencil, Clock3, CheckCircle2, ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './admin.css';

type Session = { user: { id: string; email?: string } };
type Profile = { user_id: string; role: 'owner' | 'editor'; created_at: string };
type Enquiry = { id: string; name: string; email: string; service: string | null; message: string | null; status: 'new'|'in_progress'|'responded'|'closed'; admin_notes: string|null; created_at: string; updated_at: string };
type Content = { slug: string; title: string; content: Record<string, unknown>|string; seo_title: string|null; seo_description: string|null; status: 'draft'|'published'; updated_at: string };
type Audit = { id: number; actor_id: string; action: string; target_type: string; target_id: string|null; details: Record<string, unknown>; created_at: string };
type Page = 'overview'|'enquiries'|'content'|'seo'|'audit';
const nav: {id:Page;label:string;hint:string;icon:typeof LayoutDashboard}[] = [
  {id:'overview',label:'Overview',hint:'Workspace pulse',icon:LayoutDashboard},
  {id:'enquiries',label:'Enquiries',hint:'Incoming requests',icon:Inbox},
  {id:'content',label:'Content studio',hint:'Site copy & pages',icon:FileText},
  {id:'seo',label:'SEO settings',hint:'Search appearance',icon:Globe2},
  {id:'audit',label:'Audit trail',hint:'Admin activity',icon:Activity},
];
const statusText: Record<Enquiry['status'],string> = {new:'New',in_progress:'In progress',responded:'Responded',closed:'Closed'};
const fmt=(v:string)=>new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(v));
const date=(v:string)=>new Intl.DateTimeFormat('en-IN',{dateStyle:'medium'}).format(new Date(v));

export default function AdminApp() {
  const [session,setSession]=useState<Session|null>(null),[profile,setProfile]=useState<Profile|null>(null);
  const [authBusy,setAuthBusy]=useState(true),[email,setEmail]=useState('maveriqode@gmail.com'),[password,setPassword]=useState('');
  const [recovery,setRecovery]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [passwordReset,setPasswordReset]=useState(false),[newPassword,setNewPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState('');
  const [page,setPage]=useState<Page>('overview'),[mobileOpen,setMobileOpen]=useState(false);
  const [enquiries,setEnquiries]=useState<Enquiry[]>([]),[contents,setContents]=useState<Content[]>([]),[audit,setAudit]=useState<Audit[]>([]);
  const [busy,setBusy]=useState(false),[dataError,setDataError]=useState(''),[toast,setToast]=useState('');
  const [search,setSearch]=useState(''),[filter,setFilter]=useState('all');
  const [selected,setSelected]=useState<Enquiry|null>(null),[draftStatus,setDraftStatus]=useState<Enquiry['status']>('new'),[draftNotes,setDraftNotes]=useState('');
  const [editing,setEditing]=useState<Content|null>(null),[json,setJson]=useState('{}'),[jsonError,setJsonError]=useState('');
  const [saving,setSaving]=useState(false),[seoTitle,setSeoTitle]=useState(''),[seoDescription,setSeoDescription]=useState('');

  const verify=useCallback(async(s:Session|null)=>{
    if(!s){setSession(null);setProfile(null);setAuthBusy(false);return;}
    const {data,error:lookupError}=await supabase.from('website_admins').select('user_id,role,created_at').eq('user_id',s.user.id).maybeSingle();
    if(lookupError||!data){await supabase.auth.signOut();setSession(null);setProfile(null);setError(lookupError?'Unable to verify administrator access.':'This account is not approved for the website admin.');}
    else{setSession(s);setProfile(data as Profile);setError('');}
    setAuthBusy(false);
  },[]);
  useEffect(()=>{
    document.title='MAVERIQODE Admin — Control Center';
    if (window.location.hash.includes('type=recovery')) setPasswordReset(true);
    supabase.auth.getSession().then(({data})=>void verify(data.session as Session|null));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,s)=>{if(event==='PASSWORD_RECOVERY')setPasswordReset(true);window.setTimeout(()=>void verify(s as Session|null),0);});
    return ()=>subscription.unsubscribe();
  },[verify]);

  const refresh=useCallback(async()=>{
    if(!session)return;setBusy(true);setDataError('');
    const [e,c,a]=await Promise.all([
      supabase.from('website_enquiries').select('*').order('created_at',{ascending:false}).limit(250),
      supabase.from('website_content').select('*').order('updated_at',{ascending:false}),
      supabase.from('website_audit_logs').select('*').order('created_at',{ascending:false}).limit(100),
    ]);
    const issue=e.error||c.error||a.error;if(issue)setDataError(issue.message);
    if(e.data)setEnquiries(e.data as Enquiry[]);if(c.data){setContents(c.data as Content[]);const seo=(c.data as Content[]).find(x=>x.slug==='site-seo');if(seo){setSeoTitle(seo.seo_title||'');setSeoDescription(seo.seo_description||'');}}if(a.data)setAudit(a.data as Audit[]);
    setBusy(false);
  },[session]);
  useEffect(()=>{void refresh();},[refresh]);
  useEffect(()=>{if(!toast)return;const t=window.setTimeout(()=>setToast(''),3000);return()=>window.clearTimeout(t);},[toast]);

  const log=async(action:string,target_type:string,target_id:string|null,details:Record<string,unknown>={})=>{
    if(!session)return;const {error:e}=await supabase.from('website_audit_logs').insert({actor_id:session.user.id,action,target_type,target_id,details});
    if(e)console.warn('Audit event failed',e.message);
  };
  const counts=useMemo(()=>({total:enquiries.length,fresh:enquiries.filter(x=>x.status==='new').length,active:enquiries.filter(x=>x.status==='in_progress').length,published:contents.filter(x=>x.status==='published').length}),[enquiries,contents]);
  const visible=useMemo(()=>enquiries.filter(x=>(filter==='all'||x.status===filter)&&(!search.trim()||[x.name,x.email,x.service||'',x.message||''].join(' ').toLowerCase().includes(search.toLowerCase()))),[enquiries,filter,search]);

  const login=async(e:FormEvent)=>{e.preventDefault();setError('');setNotice('');setAuthBusy(true);const {data,error:e2}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(e2){setError(e2.message);setAuthBusy(false);}else await verify(data.session as Session|null);};
  const sendReset=async(e:FormEvent)=>{e.preventDefault();setError('');const {error:e2}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/admin'});if(e2)setError(e2.message);else setNotice('Password reset link sent. Check your inbox.');};
  const updatePassword=async(e:FormEvent)=>{e.preventDefault();setError('');if(newPassword.length<10){setError('Use at least 10 characters.');return;}if(newPassword!==confirmPassword){setError('Passwords do not match.');return;}const {error:e2}=await supabase.auth.updateUser({password:newPassword});if(e2)setError(e2.message);else{setPasswordReset(false);setNewPassword('');setConfirmPassword('');setToast('Password updated successfully.');window.history.replaceState({},document.title,window.location.pathname);}};
  const signOut=async()=>{await supabase.auth.signOut();setPage('overview');};

  const openEnquiry=(x:Enquiry)=>{setSelected(x);setDraftStatus(x.status);setDraftNotes(x.admin_notes||'');};
  const saveEnquiry=async()=>{if(!selected)return;setSaving(true);const {error:e}=await supabase.from('website_enquiries').update({status:draftStatus,admin_notes:draftNotes.trim(),updated_at:new Date().toISOString()}).eq('id',selected.id);
    if(e)setToast('Save failed: '+e.message);else{await log('enquiry.updated','website_enquiry',selected.id,{status:draftStatus});setSelected(null);setToast('Enquiry updated');await refresh();}setSaving(false);};
  const editContent=(x:Content)=>{setEditing({...x});setJson(typeof x.content==='string'?x.content:JSON.stringify(x.content,null,2));setJsonError('');};
  const saveContent=async()=>{if(!editing)return;let parsed:Record<string,unknown>;try{const p:unknown=JSON.parse(json);if(!p||typeof p!=='object'||Array.isArray(p))throw new Error('Content must be a JSON object.');parsed=p as Record<string,unknown>;}catch(e){setJsonError(e instanceof Error?e.message:'Invalid JSON');return;}
    setSaving(true);const {error:e}=await supabase.from('website_content').update({title:editing.title,content:parsed,seo_title:editing.seo_title,seo_description:editing.seo_description,status:editing.status,updated_by:session?.user.id,updated_at:new Date().toISOString()}).eq('slug',editing.slug);
    if(e)setJsonError(e.message);else{await log('content.updated','website_content',editing.slug,{status:editing.status});setEditing(null);setToast('Content saved');await refresh();}setSaving(false);};
  const createContent=async()=>{const slug=window.prompt('New content slug (lowercase, hyphens only):');if(!slug)return;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){setToast('Use lowercase letters, numbers and hyphens only.');return;}
    const {error:e}=await supabase.from('website_content').insert({slug,title:slug.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '),content:{},status:'draft',seo_title:'',seo_description:'',updated_by:session?.user.id});
    if(e)setToast('Create failed: '+e.message);else{await log('content.created','website_content',slug);setToast('Draft created');await refresh();}};

  const saveSeo=async()=>{const row=contents.find(x=>x.slug==='site-seo');if(!row){setToast('SEO record is missing. Refresh and try again.');return;}setSaving(true);const {error:e}=await supabase.from('website_content').update({seo_title:seoTitle.trim(),seo_description:seoDescription.trim(),status:'published',updated_by:session?.user.id,updated_at:new Date().toISOString()}).eq('slug','site-seo');if(e)setToast('SEO save failed: '+e.message);else{await log('seo.updated','website_content','site-seo');setToast('SEO metadata published');await refresh();}setSaving(false);};

  if(authBusy)return <div className="admin-loading"><span className="admin-mark">M</span><p>Verifying secure workspace…</p></div>;
  if(session&&profile&&passwordReset)return <main className="admin-auth"><div className="admin-auth-glow"/><section className="admin-auth-card"><a className="admin-brand" href="/"><span className="admin-mark">M</span><span>MAVERIQODE<small>CONTROL CENTER</small></span></a><div className="admin-eyebrow"><ShieldCheck size={14}/> ACCOUNT SECURITY</div><h1>Set a new password.</h1><p className="admin-subtitle">Choose a strong password to finish securing your administrator account.</p>{error&&<div className="admin-alert error">{error}</div>}<form className="admin-auth-form" onSubmit={updatePassword}><label>New password<input type="password" minLength={10} value={newPassword} onChange={e=>setNewPassword(e.target.value)} autoComplete="new-password" required/></label><label>Confirm password<input type="password" minLength={10} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} autoComplete="new-password" required/></label><button className="admin-primary">Update password <ArrowUpRight size={16}/></button></form><div className="admin-auth-foot"><span>ENCRYPTED SESSION</span><span>SUPABASE AUTH</span></div></section></main>;
  if(!session||!profile)return <main className="admin-auth"><div className="admin-auth-glow"/><section className="admin-auth-card">
    <a className="admin-brand" href="/"><span className="admin-mark">M</span><span>MAVERIQODE<small>CONTROL CENTER</small></span></a>
    <div className="admin-eyebrow"><ShieldCheck size={14}/> PRIVATE ADMIN ACCESS</div><h1>{recovery?'Reset access.':'Welcome back.'}</h1><p className="admin-subtitle">A private workspace for the MAVERIQODE website. Only approved administrators can enter.</p>
    {error&&<div className="admin-alert error">{error}</div>}{notice&&<div className="admin-alert success">{notice}</div>}
    <form className="admin-auth-form" onSubmit={recovery?sendReset:login}>
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required/></label>
      {!recovery&&<label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>}
      <button className="admin-primary" disabled={authBusy}>{recovery?'Send reset link':'Sign in securely'} <ArrowUpRight size={16}/></button>
      <button type="button" className="admin-text-button" onClick={()=>{setRecovery(!recovery);setError('');setNotice('');}}>{recovery?'Back to sign in':'Forgot password?'}</button>
    </form>
    <div className="admin-auth-foot"><span>ENCRYPTED SESSION</span><span>SUPABASE AUTH</span></div><a href="/" className="admin-back">← Return to public website</a>
  </section></main>;

  const current=nav.find(x=>x.id===page)||nav[0];
  return <div className="admin-shell">
    <aside className={'admin-sidebar '+(mobileOpen?'open':'')}><a className="admin-brand" href="/"><span className="admin-mark">M</span><span>MAVERIQODE<small>CONTROL CENTER</small></span></a>
      <div className="admin-side-label">WORKSPACE</div><nav>{nav.map(item=>{const Icon=item.icon;return <button key={item.id} className={page===item.id?'active':''} onClick={()=>{setPage(item.id);setMobileOpen(false);}}><Icon size={17}/><span>{item.label}</span>{item.id==='enquiries'&&counts.fresh>0&&<i>{counts.fresh}</i>}</button>;})}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-protected"><ShieldCheck size={17}/><span><b>Access protected</b><small>{profile.role} account</small></span><i/></div><button onClick={signOut}><LogOut size={16}/> Sign out</button></div>
    </aside>
    {mobileOpen&&<button className="admin-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
    <main className="admin-main"><header className="admin-topbar"><div className="admin-top-left"><button className="admin-mobile-toggle" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu size={19}/></button><div><div className="admin-crumb">MAVERIQODE <span>/</span> {current.label.toUpperCase()}</div><p>{current.hint}</p></div></div><div className="admin-top-right"><span className="admin-live"><i/> LIVE WORKSPACE</span><button className="admin-icon-button" aria-label="Refresh" onClick={()=>void refresh()}><RefreshCw size={16} className={busy?'spin':''}/></button><div className="admin-user"><span>{(session.user.email||'M').slice(0,1).toUpperCase()}</span><div><b>{session.user.email}</b><small>{profile.role.toUpperCase()} ADMIN</small></div><ChevronDown size={14}/></div></div></header>
      <div className="admin-content">{dataError&&<div className="admin-alert error">{dataError}</div>}
      {page==='overview'&&<><PageHeading eyebrow="OPERATIONS SNAPSHOT" title="Good to see you." copy="Here’s what’s happening across your website workspace." action={<span className="admin-date"><Clock3 size={14}/>{new Intl.DateTimeFormat('en-IN',{dateStyle:'full'}).format(new Date())}</span>}/>
        <div className="admin-stats"><Stat label="Total enquiries" value={counts.total} note="Requests received" icon={Mail}/><Stat label="New enquiries" value={counts.fresh} note="Awaiting review" icon={Inbox} hot/><Stat label="In progress" value={counts.active} note="Being handled" icon={Activity}/><Stat label="Published content" value={counts.published} note="Live content records" icon={Globe2}/></div>
        <div className="admin-panels"><section className="admin-panel"><PanelHead eyebrow="INBOX" title="Recent enquiries" action={<button className="admin-link" onClick={()=>setPage('enquiries')}>View inbox <ArrowUpRight size={14}/></button>}/>{enquiries.length===0?<Empty title="No enquiries yet" copy="Website contact requests will appear here after the contact form is connected."/>:<div className="admin-recent">{enquiries.slice(0,5).map(x=><button key={x.id} onClick={()=>openEnquiry(x)}><span className="admin-row-avatar">{x.name.slice(0,1).toUpperCase()}</span><span className="admin-row-copy"><b>{x.name}</b><small>{x.service||'General enquiry'} · {date(x.created_at)}</small></span><Status status={x.status}/><ChevronRight size={15}/></button>)}</div>}</section>
        <section className="admin-panel"><PanelHead eyebrow="SYSTEM" title="Workspace activity"/>{audit.length===0?<Empty title="No activity recorded" copy="Administrator actions will appear in the audit trail."/>:<div className="admin-timeline">{audit.slice(0,6).map(x=><div key={x.id}><i/><span><b>{x.action.replaceAll('.',' ')}</b><small>{x.target_type} · {fmt(x.created_at)}</small></span></div>)}</div>}</section></div>
      </>}
      {page==='enquiries'&&<><PageHeading eyebrow="CLIENT COMMUNICATION" title="Enquiries" copy="Review inbound requests and keep every conversation moving." action={<span className="admin-count">{visible.length} records</span>}/><section className="admin-panel"><div className="admin-toolbar"><div className="admin-search"><Search size={16}/><input placeholder="Search name, email or service…" value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="admin-filter"><Filter size={15}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="in_progress">In progress</option><option value="responded">Responded</option><option value="closed">Closed</option></select></div></div>
        {visible.length===0?<Empty title="Nothing to show" copy={enquiries.length?'Try another search or status filter.':'Website contact submissions will appear here.'}/>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>CONTACT</th><th>SERVICE</th><th>RECEIVED</th><th>STATUS</th><th/></tr></thead><tbody>{visible.map(x=><tr key={x.id} onClick={()=>openEnquiry(x)}><td><b>{x.name}</b><small>{x.email}</small></td><td>{x.service||'—'}</td><td>{fmt(x.created_at)}</td><td><Status status={x.status}/></td><td><ChevronRight size={16}/></td></tr>)}</tbody></table></div>}</section></>}
      {page==='content'&&<><PageHeading eyebrow="WEBSITE MANAGEMENT" title="Content studio" copy="Manage the public pages, section copy, metadata, and publication state from one place." action={<button className="admin-primary compact" onClick={()=>void createContent()}><Plus size={15}/> New content</button>}/><section className="admin-panel"><PanelHead eyebrow="CONTENT RECORDS" title="Published & draft entries"/><div className="admin-seo-note"><FileText size={18}/><div><b>Public section content</b><p>The four public sections are now CMS-controlled. Company supports <code>principles</code>, <code>process</code>, and <code>faqs</code>; Capabilities and Solutions use <code>items</code> with <code>details</code>, <code>tags</code>, and <code>meta</code>; Work uses verified archive entries only. Edit the JSON and publish to update the matching section. Drafts stay private.</p></div></div>{contents.length===0?<Empty title="No content records yet" copy="Your public site currently uses source-controlled content. Create a published record with slug company, capabilities, solutions, or work to add a CMS-managed block to that public section."/>:<div className="admin-content-list">{contents.map(x=><div className="admin-content-row" key={x.slug}><span className="admin-content-icon"><FileText size={18}/></span><span className="admin-row-copy"><b>{x.title}</b><small>/{x.slug} · Updated {date(x.updated_at)}</small></span><span className={'admin-publish '+x.status}>{x.status}</span><button className="admin-icon-button" onClick={()=>editContent(x)} aria-label={'Edit '+x.title}><Pencil size={15}/></button></div>)}</div>}</section></>}
      {page==='seo'&&<><PageHeading eyebrow="DISCOVERABILITY" title="SEO settings" copy="Edit the default search title and description used by the public website."/><section className="admin-panel admin-seo"><div className="admin-eyebrow">SEARCH RESULT PREVIEW</div><span>maveriqode.tech ›</span><h2>{seoTitle||'MAVERIQODE'}</h2><p>{seoDescription||'Add a concise description for search engines.'}</p><label className="admin-field">SEO TITLE<input maxLength={70} value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} placeholder="MAVERIQODE — Digital Engineering"/></label><label className="admin-field">META DESCRIPTION<textarea rows={4} maxLength={180} value={seoDescription} onChange={e=>setSeoDescription(e.target.value)} placeholder="Describe what MAVERIQODE builds."/></label><div className="admin-seo-foot"><span>{seoTitle.length}/70 title · {seoDescription.length}/180 description</span><button className="admin-primary compact" onClick={()=>void saveSeo()} disabled={saving}>{saving?'Publishing…':'Save SEO settings'} <Save size={15}/></button></div><div className="admin-seo-note"><ShieldCheck size={18}/><div><b>Published metadata</b><p>Saved values are read by the public website on page load. Search engines may take time to recrawl and display updated snippets.</p></div></div></section></>}
      {page==='audit'&&<><PageHeading eyebrow="SECURITY & ACCOUNTABILITY" title="Audit trail" copy="Append-only record of administrator actions." action={<span className="admin-count">{audit.length} events loaded</span>}/><section className="admin-panel"><PanelHead eyebrow="IMMUTABLE LOG" title="Recent events"/>{audit.length===0?<Empty title="No events recorded" copy="Administrator actions will be listed here."/>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ACTION</th><th>TARGET</th><th>DETAILS</th><th>TIME</th></tr></thead><tbody>{audit.map(x=><tr key={x.id}><td><b>{x.action}</b><small>{x.actor_id.slice(0,8)}…</small></td><td>{x.target_type}<small>{x.target_id||'—'}</small></td><td><code>{JSON.stringify(x.details||{})}</code></td><td>{fmt(x.created_at)}</td></tr>)}</tbody></table></div>}</section></>}
      <div className="admin-footnote"><span>Live data from the MAVERIQODE website Supabase project.</span><span>{busy?'Refreshing…':'Secure session active'}</span></div>
      </div></main>
    {selected&&<div className="admin-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section className="admin-modal"><div className="admin-modal-head"><div><div className="admin-eyebrow">ENQUIRY DETAIL</div><h2>{selected.name}</h2></div><button className="admin-icon-button" onClick={()=>setSelected(null)}><X size={18}/></button></div><a className="admin-mail-link" href={'mailto:'+selected.email}><Mail size={15}/>{selected.email}<ExternalLink size={13}/></a><div className="admin-detail-meta"><span>{selected.service||'General enquiry'}</span><span>{fmt(selected.created_at)}</span></div><div className="admin-message">{selected.message||'No message supplied.'}</div><label className="admin-field">STATUS<select value={draftStatus} onChange={e=>setDraftStatus(e.target.value as Enquiry['status'])}><option value="new">New</option><option value="in_progress">In progress</option><option value="responded">Responded</option><option value="closed">Closed</option></select></label><label className="admin-field">PRIVATE ADMIN NOTES<textarea rows={4} value={draftNotes} onChange={e=>setDraftNotes(e.target.value)} placeholder="Internal follow-up notes…"/></label><div className="admin-modal-actions"><button className="admin-secondary" onClick={()=>setSelected(null)}>Cancel</button><button className="admin-primary compact" onClick={()=>void saveEnquiry()} disabled={saving}>{saving?'Saving…':'Save changes'} <Save size={15}/></button></div></section></div>}
    {editing&&<div className="admin-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setEditing(null);}}><section className="admin-modal admin-editor"><div className="admin-modal-head"><div><div className="admin-eyebrow">CONTENT EDITOR · /{editing.slug}</div><h2>Edit content</h2></div><button className="admin-icon-button" onClick={()=>setEditing(null)}><X size={18}/></button></div><label className="admin-field">TITLE<input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})}/></label><div className="admin-editor-help">This record controls the matching public section. Common keys: eyebrow, heading, intro, secondaryIntro, items, principles, process, faqs, note, ctaLabel, ctaHref. Items support eyebrow, title, description, details (list), tags (list), and meta. Company uses principles, process, and faqs. Publish to replace the source fallback; drafts remain private.</div><label className="admin-field">CONTENT JSON<textarea className="admin-code" rows={11} spellCheck={false} value={json} onChange={e=>setJson(e.target.value)}/></label><div className="admin-form-grid"><label className="admin-field">SEO TITLE<input value={editing.seo_title||''} onChange={e=>setEditing({...editing,seo_title:e.target.value})}/></label><label className="admin-field">PUBLICATION<select value={editing.status} onChange={e=>setEditing({...editing,status:e.target.value as Content['status']})}><option value="draft">Draft</option><option value="published">Published</option></select></label></div><label className="admin-field">SEO DESCRIPTION<textarea rows={3} value={editing.seo_description||''} onChange={e=>setEditing({...editing,seo_description:e.target.value})}/></label>{jsonError&&<div className="admin-alert error">{jsonError}</div>}<div className="admin-modal-actions"><button className="admin-secondary" onClick={()=>setEditing(null)}>Cancel</button><button className="admin-primary compact" onClick={()=>void saveContent()} disabled={saving}>{saving?'Saving…':'Save content'} <Save size={15}/></button></div></section></div>}
    {toast&&<div className="admin-toast"><CheckCircle2 size={16}/>{toast}</div>}
  </div>;
}

function PageHeading({eyebrow,title,copy,action}:{eyebrow:string;title:string;copy:string;action?:ReactNode}){return <div className="admin-page-heading"><div><div className="admin-eyebrow"><Sparkles size={14}/>{eyebrow}</div><h1>{title}</h1><p>{copy}</p></div>{action&&<div className="admin-heading-action">{action}</div>}</div>;}
function PanelHead({eyebrow,title,action}:{eyebrow:string;title:string;action?:React.ReactNode}){return <div className="admin-panel-head"><div><span className="admin-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action}</div>;}
function Stat({label,value,note,icon:Icon,hot=false}:{label:string;value:number;note:string;icon:typeof LayoutDashboard;hot?:boolean}){return <div className={'admin-stat '+(hot?'hot':'')}><div><span>{label}</span><Icon size={18}/></div><strong>{value.toLocaleString('en-IN')}</strong><small>{note}</small></div>;}
function Status({status}:{status:Enquiry['status']}){return <span className={'admin-status '+status}><i/>{statusText[status]}</span>;}
function Empty({title,copy}:{title:string;copy:string}){return <div className="admin-empty"><span><Inbox size={20}/></span><b>{title}</b><p>{copy}</p></div>;}
