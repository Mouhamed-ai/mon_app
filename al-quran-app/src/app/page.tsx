import Link from "next/link";
const cards=[
  {title:"Lire le Coran",text:"114 sourates, navigation par Juz et reprise de lecture.",href:"/quran"},
  {title:"Écouter",text:"Récitateurs, répétition et écoute hors connexion.",href:"/listen"},
  {title:"Mémoriser",text:"Objectifs quotidiens, révision et statistiques.",href:"/study"}
] as const;
export default function Home(){return <main className="shell"><nav className="nav"><b className="brand">۞ Al-Quran</b><Link className="pill" href="/quran">Ouvrir le Coran</Link></nav><section className="hero"><p className="eyebrow">VOTRE COMPAGNON QUOTIDIEN</p><h1>Lire, écouter et méditer le Coran.</h1><p className="muted">Une expérience d’étude respectueuse, élégante et conçue pour chaque écran.</p></section><section className="cards">{cards.map(({title,text,href})=><Link className="card" key={title} href={href}><b>{title}</b><p className="muted">{text}</p><small className="eyebrow">Ouvrir →</small></Link>)}</section></main>}
