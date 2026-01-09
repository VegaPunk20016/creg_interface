'use client';
import { Bot, Menu, Info, Layers, Search, Download, ExternalLink, Terminal } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Container from '../components/ui/Container';
import FeatureCard from '../components/ui/FeatureCard';
import Link from 'next/link';
import ilustracionImg from '../../public/ilustracion_1.png'; 
import Image from 'next/image';



const sources = [
  { name: 'INEGI', verified: true, url: 'https://www.inegi.org.mx/' },
  { name: 'Transparencia Presupuestaria', verified: true, url: 'https://www.transparenciapresupuestaria.gob.mx/' },
  { name: 'CONEVAL', verified: true, url: 'https://www.coneval.org.mx/' },
  { name: 'Hacienda', verified: true, url: 'https://www.hacienda.gob.mx/' },
]


export default function LandingPage() {
  return (
    <main className="overflow-x-hidden font-display">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-10 min-h-screen w-full flex flex-col justify-center bg-background-dark overflow-hidden">
        {/* Decoración Fondo */}
        <div className="absolute inset-0 bg-hero-glow"></div>
        <div className="particle w-24 h-24 top-1/4 left-1/4 blur-3xl"></div>
        <div className="particle w-64 h-64 bottom-1/4 right-1/4 blur-[100px] bg-primary/20"></div>

        {/* Header Visual */}
        <div className="absolute top-0 left-0 w-full z-50 p-6">
            <Container className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <Bot className="size-6" />
                    </div>
                    <h2 className="text-white text-xl font-extrabold tracking-tight">CREG DATA</h2>
                </div>
            
            </Container>
        </div>
        <Container className="relative z-10 w-full py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight drop-shadow-lg">
                Inteligencia de Datos <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">Abiertos</span> 
              </h1>
              <p className="text-blue-100 text-lg sm:text-xl leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0 opacity-90">
                Explora, compara y entiende la información financiera y territorial de tu municipio de forma fácil, visual y divertida.
              </p>
              <Badge 
                text="Versión 1.0" 
                pulsing={true} 
                className="mx-auto lg:mx-0 bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* Imagen 3D Hero */}
            <div className="flex-1 w-full flex justify-center lg:justify-end animate-float">
              <div className="relative w-full max-w-500px aspect-4/5 rounded-3xl
              overflow-hidden shadow-2xl border-4 border-white/5 bg-linear-to-b
                from-blue-900/50 to-transparent backdrop-blur-sm group cursor-pointer">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-950/40 p-10 text-center">
                  <Image
                    src={ilustracionImg}
                    alt="Ilustración de datos abiertos"
                    className="mb-4 object-contain transition-transform duration-500 group-hover:scale-110"
                    priority 
                    />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- ACERCA DE --- */}
      <section className="py-20 lg:py-32 bg-white" id="acerca">
        <Container>
          <div className="bg-[#F8FAFC] rounded-[3rem] p-8 lg:p-16 border border-slate-100 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 flex flex-col gap-6 order-2 lg:order-1">
                
                <Badge 
                  icon={Info} 
                  text="Acerca de CREG DATA" 
                  className="border-transparent text-primary"
                />

                <h2 className="text-[#051733] text-3xl lg:text-4xl font-black leading-tight">
                  Transformamos el caos en claridad.
                </h2>
                <p className="text-[#4b5563] text-lg leading-relaxed">
                  Los datos públicos suelen estar atrapados en PDFs complejos y tablas difíciles de leer. 
                  Nuestra plataforma utiliza tecnología inteligente para convertir esos documentos desordenados en información visual.
                </p>
                
                {/* Stats */}
                <div className="pt-4 flex gap-8 border-t border-gray-200 mt-4">
                  {[
                    { val: '32+', label: 'Estados' },
                    { val: '2K+', label: 'Municipios' },
                    { val: '100%', label: 'Gratuito' }
                  ].map((stat, i) => (
                    <div key={i}>
                      <h3 className="text-3xl font-black text-primary">{stat.val}</h3>
                      <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full order-1 lg:order-2">
                <div className="aspect-video w-full rounded-3xl bg-gray-100 overflow-hidden relative shadow-inner group flex items-center justify-center">
                    <div className="text-center p-8 opacity-40">
                        <div className="flex gap-4 items-end h-32 justify-center mb-4">
                            <div className="w-8 h-16 bg-blue-300 rounded-t-lg"></div>
                            <div className="w-8 h-24 bg-primary rounded-t-lg"></div>
                            <div className="w-8 h-20 bg-blue-400 rounded-t-lg"></div>
                        </div>
                        <p className="font-bold text-gray-400">Datos Simplificados</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- CÓMO FUNCIONA --- */}
      <section className="py-20 bg-linear-to-b from-blue-50 via-white to-white relative overflow-hidden" id="como-funciona">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl"></div>

        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#051733] text-3xl lg:text-4xl font-black mb-4">¿Cómo funciona?</h2>
            <p className="text-[#4b5563] text-lg">Un proceso simple de tres pasos para entender la realidad de tu municipio.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard 
              step={1} 
              icon={Layers} 
              title="Organiza" 
              description="Nuestros algoritmos estructuran la información pública dispersa en bases de datos coherentes y estandarizadas."
            />
            <FeatureCard 
              step={2} 
              icon={Search} 
              title="Explora y Compara" 
              description="Visualiza indicadores financieros y territoriales. Compara tu municipio con otros similares en tiempo real."
            />
            <FeatureCard 
              step={3} 
              icon={Download} 
              title="Exporta" 
              description="Descarga los reportes y las bases de datos limpias en formatos abiertos (CSV, JSON, PDF) para tu propio uso."
            />
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm font-semibold text-primary bg-blue-50 inline-block px-4 py-2 rounded-full border border-blue-100">
              * Datos actualizados trimestralmente según disponibilidad oficial.
            </p>
          </div>
        </Container>
      </section>

      {/* --- FUENTES --- */}
      <section className="py-20 bg-white border-t border-gray-100" id="fuentes">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-[#051733] text-2xl lg:text-3xl font-bold mb-2">Fuentes de Datos Oficiales</h2>
              <p className="text-[#64748b]">La confiabilidad es nuestra prioridad. Solo utilizamos fuentes verificadas.</p>
            </div>
          </div>

          {/* Esto nos ayuda a definir cada contenido de las cardas que aparecen, mapea la const sources */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {sources.map((source, index) => (
            <Link 
              key={index} 
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all hover:border-blue-100 bg-white cursor-pointer"
              >
            <div className={`h-12 w-auto transition-all opacity-70 group-hover:opacity-100 flex items-center justify-center font-bold text-xl text-gray-400 ${source.color || 'group-hover:text-primary'}`}>
              {source.name}
            </div>
      
      <div className="flex items-center gap-1 text-xs text-center text-gray-400 group-hover:text-gray-600">
        <span>Fuente Verificada</span>
        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  ))}
</div>
        </Container>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#051733] text-white pt-16 pb-8 border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Bot className="size-5" />
                </div>
                <h2 className="text-white text-xl font-extrabold tracking-tight">CREG DATA</h2>
              </div>
              <p className="text-blue-200/60 text-sm leading-relaxed max-w-sm">
                Una iniciativa independiente para democratizar el acceso a la información pública en México. Porque los datos son de todos.
              </p>
            </div>
            
            <div className="md:col-span-8">
              <h4 className="font-bold mb-4 text-white">Aviso Legal</h4>
              <p className="text-xs text-blue-200/40 text-justify leading-relaxed">
                  La información presentada en esta plataforma se obtiene de fuentes públicas oficiales. CREG DATA no genera la información primaria y no se hace responsable por errores u omisiones en los datos de origen. El uso de esta plataforma es gratuito y tiene fines informativos y educativos.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-blue-200/40 text-center md:text-left">
              © 2026 CREG DATA versión 1.0. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-200/60 font-medium">Desarrollado por</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <Terminal className="size-3 text-primary" />
                <a href="https://www.iidesoft.com.mx" target="_blank" rel="noopener noreferrer"><span className="text-xs font-bold tracking-wide">IIDESOFT México</span></a>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}