import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Al-Quran App",description:"Lire, écouter et étudier le Saint Coran"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
