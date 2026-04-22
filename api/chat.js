const Groq = require("groq-sdk");

// ============================================================
// GROQ API — API Key directamente en el código
// ============================================================
const groq = new Groq({
  apiKey: "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",
});

// ============================================================
// BASE DE CONOCIMIENTO — Chunks para el Retriever
// ============================================================
const KNOWLEDGE_CHUNKS = [
  "Lumina Radiance es una marca de cosméticos para el cuidado personal femenino. La página está diseñada para inspirar, educar y promocionar productos que enfatizan la belleza auténtica con ingredientes nobles y naturales. Tiene un diseño femenino, elegante y moderno adaptado para celular, tablet y computadora.",
  "Lumina Radiance ofrece tres colecciones: Cuidado Facial con cremas y serums, Maquillaje Natural con bases ligeras y tonos neutros, y Cuidado Corporal con lociones y exfoliantes naturales.",
  "La colección de Cuidado Facial incluye cremas hidratantes y serums diseñados para combatir la resequedad y devolver luminosidad al rostro. Están formulados con ingredientes puros que penetran en las capas profundas de la piel. Son ideales para prevenir los signos de la edad y mantener la piel suave y radiante.",
  "La colección de Maquillaje Natural incluye bases ligeras, iluminadores sutiles y tonos neutros que embellecen sin dañar la piel. Los acabados son sedosos y no obstruyen los poros. Son perfectos para el uso diario con un look fresco y saludable.",
  "La colección de Cuidado Corporal ofrece lociones y exfoliantes elaborados con ingredientes 100% naturales. Nutren el cuerpo de pies a cabeza, mejoran la elasticidad y dejan una sensación duradera de suavidad. Permiten una experiencia tipo spa en casa.",
  "Para consultar precios, hacer un pedido o saber más sobre disponibilidad y envíos, usa el formulario de contacto al final de la página en la sección Ponte en Contacto. Solo necesitas tu nombre, correo y mensaje. Nuestro equipo te responderá a la brevedad.",
  "El formulario de contacto está al final de la página. Completa tu nombre, correo electrónico y mensaje o consulta. Luego haz clic en el botón rojo terracota que dice Enviar Mensaje. Nuestro equipo te responderá pronto.",
  "El orden correcto para maquillarse es: primero aplica prebase o primer para preparar la piel, luego corrector en ojeras e imperfecciones, después base de maquillaje para unificar el tono, a continuación rubor o bronzer en las mejillas, luego sombras de ojos del tono más claro al más oscuro, después delineador y máscara de pestañas para definir la mirada, y finalmente el labial como toque final.",
  "Para un maquillaje de día o para la oficina usa base ligera o BB cream, corrector solo donde lo necesites, un toque de rubor durazno o rosa suave en las mejillas, máscara de pestañas en marrón o negro y un gloss o labial nude. Menos es más: una piel bien cuidada hace que el maquillaje luzca mucho mejor.",
  "Para un maquillaje nocturno o de fiesta usa base de cobertura media alta con acabado luminoso, contorno para definir pómulos y mandíbula, iluminador en los puntos altos del rostro, sombras ahumadas en tonos oscuros, delineador en gel para un cat eye, pestañas postizas o máscara voluminizadora, y labial rojo, vino o nude intenso. Fija todo con spray fijador.",
  "Para piel seca elige base con ácido hialurónico o aceites con acabado luminoso o satinado. Para piel grasa elige base a base de agua o libre de aceite con acabado mate. Para piel mixta usa fórmula equilibrante con acabado semimate. Para piel sensible busca bases sin fragancia e hipoalergénicas. Para piel madura elige bases con colágeno y SPF de acabado satinado. Siempre prueba la base en la mandíbula para encontrar tu tono exacto.",
  "Para piel seca lo mejor es una base con ácido hialurónico, glicerina o aceites nutritivos. El acabado debe ser luminoso o satinado, nunca mate porque resalta la sequedad. Hidrata bien la piel antes de aplicar la base.",
  "Para piel grasa elige bases a base de agua, libres de aceite y con acabado mate. Busca fórmulas que digan oil-free o non-comedogenic. Aplica polvo translúcido encima para fijar y controlar el brillo durante el día.",
  "Para piel mixta usa una base equilibrante con acabado semimate. Aplica polvo trasparente solo en la zona T que es frente, nariz y mentón donde hay más grasa, y deja luminosidad en los pómulos y sienes.",
  "La cobertura baja o sheer deja entrever la piel y es ideal para un look natural. La cobertura media oculta imperfecciones ligeras pero se ve natural. La cobertura alta cubre manchas, ojeras profundas y acné. Para el día a día se recomienda cobertura media. Para eventos o fotos, cobertura alta.",
  "El corrector debe ser de un tono más claro que tu base para ojeras y del mismo tono para imperfecciones. Para ojeras aplica en triángulo invertido debajo del ojo y difumina hacia afuera. Para granitos aplica con la yema del dedo o un pincel fino encima de la imperfección. Fija con polvo translúcido para que dure más.",
  "La prebase o primer se aplica antes de la base de maquillaje. Alarga la duración del maquillaje, minimiza los poros visibles, unifica la textura de la piel y ayuda a que la base se adhiera mejor. Aplícala sobre la piel ya hidratada y deja secar 30 segundos antes de poner la base.",
  "Para aplicar sombras de ojos usa la técnica de tres colores: tono claro en el párpado móvil y lagrimal, tono medio en la cuenca difuminado en movimientos circulares, y tono oscuro en la esquina externa y la línea de pestañas. Las paletas de tonos tierra, rosado y malva, y ahumado gris son las más versátiles. Difumina siempre los bordes con un pincel limpio.",
  "Para hacer un ahumado smoky eye empieza con una base en el párpado para que dure más. Aplica sombra oscura en toda la cuenca incluida la esquina inferior externa. Difumina muy bien hacia arriba y hacia afuera. Agrega delineador negro en la línea de agua y máscara de pestañas voluminizadora. El truco está en difuminar más que nunca.",
  "Para ojos marrones o café los tonos azul marino, morado y bronce los realzan. Para ojos verdes usa tonos morados, cobres y dorados. Para ojos azules funcionan los anaranjados, cobrizos y cobre. Las paletas neutras tierra funcionan para todos los colores de ojos y son las más fáciles de usar en el día a día.",
  "El lápiz de ojos es el más fácil para principiantes ya que se puede difuminar. El gel da más precisión y dura más. El líquido es el más preciso y dramático pero requiere práctica. Para un cat eye aplica desde el centro hacia el extremo externo del ojo y extiende hacia arriba en diagonal. Para un look natural traza solo la mitad externa del ojo.",
  "Para aplicar la máscara mueve el pincel en zigzag desde la raíz a la punta de las pestañas. Aplica dos capas para más volumen. Para alargar enfoca la brocha verticalmente. Para curvar usa rizador antes de aplicar la máscara. Nunca apliques sobre pestañas secas de capas anteriores sin remover primero.",
  "Para piel clara favorecen los rojos clásicos, rosas fríos y nudes beige. Para piel media van bien los vinos, terracota, nude marrón rosado y rojos cálidos. Para piel oscura son ideales los rojos intensos, vinos, fucsias y nudes oscuros. Evita los nudes muy claros en pieles oscuras porque pueden verse apagados.",
  "El labial mate tiene más duración y un look sofisticado pero reseca los labios, necesitas hidratarlos bien antes. El gloss o brillo da efecto visual más lleno ideal para labios finos y se ve jugoso y sensual. El labial satinado equilibra duración e hidratación y es el más versátil para uso diario.",
  "Para mantener los labios hidratados aplica bálsamo labial con SPF todos los días. Para exfoliarlos mezcla azúcar con miel o aceite de coco y frota suavemente en círculos una vez por semana. Nunca muerdas ni arranques la piel seca de los labios porque causa heridas. Beber suficiente agua también mantiene los labios hidratados desde adentro.",
  "El rubor se aplica sonriendo suavemente en las manzanas de las mejillas y se difumina hacia las sienes con movimientos circulares. El bronzer va debajo de los pómulos, en los laterales de la frente y en la mandíbula para dar un efecto bronceado. El iluminador va en los puntos altos: pómulos, puente de la nariz, arco de cupido y lagrimal. Usa brochas suaves y difumina bien los bordes.",
  "El contouring usa un producto dos o más tonos más oscuro que tu piel para crear sombras y moldear el rostro. Aplica debajo de los pómulos, en los laterales de la frente para reducirla visualmente, a los lados de la nariz para afinarla y en la línea de la mandíbula para definirla. Difumina con una brocha grande en movimientos circulares. La clave es que no se vean líneas duras.",
  "El iluminador se aplica en los puntos más altos del rostro para dar luminosidad y efecto de luz. Colócalo en la parte alta de los pómulos, el arco de Cupido en el centro del labio superior, la punta de la nariz, el lagrimal interno del ojo y el arco de las cejas. Para uso diario elige un iluminador sutil satinado. Para fiestas puedes usar uno más intenso con glitter fino.",
  "Para hacer las cejas perfectas usa la regla de los tres puntos: el inicio alinea con el borde interno del ojo, el arco va sobre la pupila o borde externo del iris, el final alinea con la comisura externa del ojo. Peina las cejas primero con espúler, rellena con lápiz usando trazos cortos imitando pelitos, y fija con gel de cejas transparente o del color de tu cabello.",
  "El lápiz de cejas da mayor control y precisión, es ideal para principiantes. La pomada da más duración y un resultado más definido ideal para cejas escasas. El polvo da un resultado más natural y difuminado. El gel de cejas fija y peina. El microblading es un tatuaje semipermanente que dura entre uno y dos años y da resultados ultra naturales.",
  "Para aplicar pestañas postizas mide la tira sobre tu ojo y córtala si es necesario. Aplica pegamento en la base y espera 30 segundos hasta que esté pegajoso. Coloca la tira desde el centro hacia afuera usando pinzas. Presiona suavemente contra tus pestañas naturales empezando por el centro, luego el extremo exterior y por último el interior. Aplica delineador negro sobre la línea de pegamento para disimularlo.",
  "Las pestañas postizas en tira son más rápidas de aplicar y dan un resultado más dramático, ideales para eventos. Las pestañas individuales o en mechones pequeños dan un resultado más natural y personalizado y son más cómodas. Las extensiones de salón duran tres o cuatro semanas sin necesitar retoque diario.",
  "La rutina de mañana debe seguir este orden: primero limpiador suave para limpiar el sebo nocturno, luego tónico para equilibrar el pH, después sérum de vitamina C para antioxidante y luminosidad, a continuación hidratante según tu tipo de piel, y al final protector solar SPF 30 o más que es indispensable todos los días sin excepción incluso en días nublados.",
  "La rutina de noche sigue este orden: primero desmaquillante o aceite limpiador para disolver el maquillaje, luego limpiador facial para una doble limpieza profunda, después tónico, a continuación sérum de noche con retinol, ácido hialurónico o niacinamida, y al final crema hidratante de noche más nutritiva que la de día. La piel se regenera mientras duermes.",
  "La doble limpieza consiste en limpiar el rostro dos veces seguidas. Primero con un limpiador en aceite o balm que disuelve el maquillaje, el protector solar y la suciedad grasa. Luego con un limpiador acuoso o espumante que limpia la piel a fondo. Es especialmente útil para quienes usan maquillaje, protector solar de alta resistencia o tienen piel con tendencia a impurezas.",
  "La vitamina C en sérum aporta luminosidad, reduce manchas y la hiperpigmentación, protege de los radicales libres como antioxidante y estimula la producción de colágeno. Se usa en la rutina de mañana antes del hidratante. No la combines con retinol o ácidos AHA y BHA en la misma aplicación. Guarda el frasco en un lugar oscuro y fresco para que no se oxide.",
  "El retinol es el ingrediente antiedad más estudiado y efectivo. Estimula el colágeno, mejora la textura de la piel, reduce arrugas, afina los poros y aclara manchas. Se usa solo de noche porque el sol lo inactiva. Empieza usando dos o tres veces por semana y aumenta la frecuencia gradualmente. Al principio puede causar rojez y descamación que desaparece conforme la piel se adapta.",
  "El ácido hialurónico es un potente humectante que atrae y retiene el agua en la piel dando un efecto plumping o relleno visual. Aplícalo sobre la piel húmeda para que funcione mejor. Sirve para todo tipo de piel incluyendo piel grasa. No tiene contraindicaciones y se puede usar en mañana y noche. Ayuda a reducir la apariencia de líneas finas cuando la piel está bien hidratada.",
  "La niacinamida o vitamina B3 regula la producción de sebo, minimiza los poros visibles, reduce manchas e hiperpigmentación, refuerza la barrera cutánea y calma rojeces. Es apta para todo tipo de piel incluyendo piel sensible y con acné. Se puede usar en mañana y noche. Es compatible con casi todos los demás activos de skincare.",
  "El ácido salicílico es un exfoliante químico tipo BHA que penetra dentro del poro para limpiar el sebo acumulado. Es ideal para piel grasa, con acné, puntos negros y poros dilatados. Se usa en tónico, sérum o mascarilla dos o tres veces por semana. No usar junto con retinol en la misma noche.",
  "El ácido glicólico es un exfoliante químico tipo AHA que trabaja en la superficie de la piel. Mejora la textura, reduce manchas, aclarando el tono de piel e iluminando el rostro. Se usa de noche porque aumenta la fotosensibilidad. Empieza con concentraciones bajas, entre el cinco y el diez por ciento. Siempre usa protector solar al día siguiente.",
  "Las ceramidas son lípidos naturales de la piel que forman parte de la barrera cutánea. Ayudan a retener la humedad, protegen de agresiones externas y reparan la piel dañada. Son especialmente útiles para piel seca, sensible o con eccema. Se encuentran en cremas hidratantes y son compatibles con todos los activos de skincare.",
  "El protector solar es el producto más importante de cualquier rutina de cuidado de la piel. Los rayos UV penetran las nubes y el vidrio y son la principal causa de envejecimiento prematuro, manchas y cáncer de piel. Úsalo todos los días como el último paso de la rutina de mañana antes del maquillaje. Reaplicar cada dos horas si estás al aire libre.",
  "Usa SPF 30 como mínimo para el día a día en interiores o con poca exposición solar. Usa SPF 50 o más si pasas tiempo al aire libre, en playa o montaña. Para piel grasa elige protectores con textura acuosa, en gel o tipo serum y acabado mate. Para piel seca elige protectores más cremosos con ingredientes hidratantes dentro. Busca siempre protectores de espectro amplio que protejan tanto de UVA como de UVB.",
  "Para piel grasa limpia con un gel limpiador sin SLS por la mañana y la noche. Usa tónico con niacinamida para regular el sebo. Aplica sérum ligero como el de niacinamida o ácido hialurónico. Hidrata con crema libre de aceite oil-free que no se sienta pesada. Usa protector solar con acabado mate. Exfolia con ácido salicílico dos veces por semana.",
  "Para piel seca usa un limpiador suave en crema o en aceite sin sulfatos agresivos. Aplica el tónico hidratante con ingredientes como agua de rosas o ácido hialurónico. Ponle sérum con ácido hialurónico o péptidos. Hidrata con una crema rica con ceramidas, manteca de karité o escualano. De noche usa un aceite facial como el de rosa mosqueta como último paso para sellar.",
  "Para piel mixta equilibra las dos zonas: limpia con gel suave o espuma ligera. Usa tónico equilibrante. Aplica hidratante ligero en toda la cara y si la zona T está muy grasa usa un producto matificante solo ahí. Exfolia con ácidos químicos suaves una o dos veces por semana. El protector solar en gel o fluido funciona bien para piel mixta.",
  "Para piel sensible elige productos sin fragancia, sin alcohol, sin colorantes y sin parabenos. Usa limpiadores en crema muy suaves. Ingredientes clave son la niacinamida, alantoína, pantenol, centella asiática y aloe vera que calman la inflamación. Evita los ácidos AHA BHA al inicio y el retinol en alta concentración. Los cambios de rutina hazlos de uno en uno para identificar qué te irrita.",
  "Para tratar el acné usa limpiador con ácido salicílico para limpiar los poros. Aplica tónico con niacinamida para reducir la inflamación y la producción de sebo. Usa un sérum puntual con zinc o benzoilo de peróxido directamente sobre los granitos. Hidrata aunque tengas piel grasa porque la sequedad empeora el acné. El protector solar es obligatorio porque el sol oscurece las marcas post-acné.",
  "Los puntos negros son poros obstruidos oxidados. Para eliminarlos usa un limpiador o tónico con ácido salicílico regularmente. Las tiras nasales solo los sacan temporalmente. Las mascarillas de arcilla absorben el exceso de sebo. El retinol a largo plazo es el más efectivo para limpiar los poros en profundidad. No los exprimas con los dedos porque inflamas más el poro.",
  "Para aclarar manchas e hiperpigmentación los ingredientes más eficaces son la vitamina C por las mañanas, la niacinamida para bloquear la transferencia de melanina, el ácido kójico y el ácido glicólico para exfoliar la capa superficial donde están las manchas. El protector solar es el paso número uno porque sin él el sol oscurece nuevamente cualquier mancha tratada. Los resultados se ven en dos o tres meses de uso constante.",
  "Las ojeras pueden ser vasculares color morado, por falta de sueño, o estructurales por pérdida de volumen. Para ojeras moradas usa corrector con subtono anaranjado o salmón para neutralizar. Para reducirlas con el cuidado, usa contorno de ojos con cafeína que activa la circulación, vitamina K que ayuda a coagular, o retinol para engrosar la piel delgada del contorno. Dormir bien y beber agua también ayuda.",
  "Para tratar las arrugas y líneas de expresión los ingredientes más eficaces son el retinol de noche que estimula el colágeno, la vitamina C de mañana como antioxidante que también estimula el colágeno, los péptidos que mandan señales a la piel para producir más colágeno, y el ácido hialurónico que hidrata y da un efecto plumping visual. El protector solar diario previene el 80 por ciento del envejecimiento externo.",
  "Para prevenir el envejecimiento prematuro sigue estos cinco pasos: usa protector solar todos los días ya que es el antiedad más potente que existe, hidrata la piel diariamente para mantener la barrera cutánea fuerte, usa vitamina C de mañana como antioxidante, introduce el retinol de noche gradualmente desde los 25 años, y duerme entre siete y ocho horas porque la piel se regenera entre las diez de la noche y las dos de la madrugada.",
  "El masaje facial mejora la circulación, ayuda a drenar los líquidos, relaja los músculos del rostro y mejora la absorción de los productos aplicados. Aplica tu crema o aceite facial y masajea con movimientos ascendentes y hacia afuera nunca hacia abajo para evitar arrastrar la piel. Usa los nudillos o los dedos o una herramienta como gua sha o roller de cuarzo. Cinco minutos diarios son suficientes.",
  "El gua sha y el roller facial son herramientas de masaje. El gua sha moldea y define el óvalo facial por sus bordes planos y realiza drenaje linfático. El roller masajea suavemente y deshincha el rostro especialmente si lo guardas en el refrigerador. Úsalos siempre con aceite o crema facial para que la herramienta deslice sin jalar la piel. Pasa siempre en dirección ascendente.",
  "Exfoliar el rostro elimina las células muertas, mejora la textura y ayuda a que los demás productos penetren mejor. Existen dos tipos: la exfoliación física con gránulos y la química con ácidos. La química es más suave y uniforme. Para pieles sensibles exfolia una vez por semana. Para pieles grasas o con acné dos o tres veces por semana. Siempre hidrata después de exfoliar.",
  "Las mascarillas de arcilla o barro son ideales para piel grasa o con poros dilatados porque absorben el exceso de sebo. Las mascarillas hidratantes con ácido hialurónico o aloe son perfectas para piel seca o después de una exfoliación. Las mascarillas iluminadoras con vitamina C o niacinamida aclaran el tono. Úsalas una o dos veces por semana como tratamiento intensivo.",
  "Para hidratar la piel seca aplica el hidratante inmediatamente después del baño sobre la piel aún húmeda para sellar la humedad. Busca ingredientes como ácido hialurónico, ceramidas, manteca de karité, glicerina y escualano. Agrega un aceite facial como último paso de la rutina de noche. Bebe mínimo dos litros de agua al día, evita duchas muy calientes y usa un humidificador si el ambiente es seco.",
  "Beber suficiente agua hidrata la piel desde adentro y mejora su elasticidad y luminosidad. Los expertos recomiendan al menos dos litros de agua al día. También puedes obtener agua de alimentos como pepino, sandía, naranja y fresas. La hidratación interna complementa pero no reemplaza la hidratación tópica con cremas y serums.",
  "Para exfoliar el cuerpo usa productos con azúcar, sal marina o café mezclados con aceite de coco o almendras. Aplica en círculos suaves sobre la piel húmeda antes o durante el baño. Exfolia entre una y dos veces por semana. Presta atención especial a codos, rodillas, talones y espalda que son zonas con más células muertas. Siempre aplica loción hidratante después de exfoliar.",
  "Para que la loción corporal sea más eficaz aplícala inmediatamente después del baño cuando la piel aún está ligeramente húmeda. Esto ayuda a sellar la humedad dentro de la piel. Para zonas muy secas como codos y talones aplica dos capas o usa una crema más espesa tipo mantequilla. Busca ingredientes como manteca de karité, aceite de jojoba, ceramidas y ácido hialurónico.",
  "Para unas piernas suaves e hidratadas exfolia una o dos veces por semana para prevenir los pelos enquistados después de la depilación. Aplica loción hidratante todos los días. Para rasurar usa gel de afeitar y rasura en la dirección del crecimiento del pelo para menos irritación. Después aplica aceite de rosa mosqueta o loción calmante para reducir el enrojecimiento.",
  "El cuello y el escote envejecen tan rápido como el rostro pero suelen olvidarse en la rutina. Aplica el sérum y la crema hidratante que usas en la cara también en el cuello y el escote. Usa el protector solar en estas áreas todos los días. Los movimientos en el cuello siempre deben ser de abajo hacia arriba para evitar arrastrar la piel hacia abajo con el paso del tiempo.",
  "Para agrandar ojos pequeños usa delineador solo en la parte superior del ojo no en la parte de abajo porque achica la mirada. Aplica sombra clara en el párpado móvil. Usa máscara de pestañas que alargue más que voluminice. Aplica iluminador en el lagrimal interno. Riza las pestañas antes de aplicar la máscara. Cepilla las cejas hacia arriba para levantar visualmente el ojo.",
  "Para elevar visualmente los ojos caídos empieza el delineador desde la mitad del ojo hacia afuera y hacia arriba en diagonal. Con las sombras aplica el tono más oscuro en la esquina externa subiendo hacia las sienes. Evita el delineador en la parte inferior de toda la longitud del ojo. Riza bien las pestañas y aplica máscara en el extremo externo para un efecto lifting.",
  "El spray fijador de maquillaje se aplica al final de toda la rutina de maquillaje para prolongar su duración y fusionar los productos dando un acabado más natural. Sostenlo a 30 centímetros del rostro y pulveriza en movimientos de X y T. También puedes usarlo entre capas para refrescar y humectar. Es ideal para días largos, eventos o climas calurosos.",
  "El polvo translúcido o incoloro fija el maquillaje líquido sin añadir cobertura ni alterar el tono. Es ideal para todos los tonos de piel. El polvo compacto sí añade cobertura y es en el tono de tu piel. Úsalos para fijar el corrector bajo los ojos presionando con una esponja, y para matificar la zona T durante el día.",
  "Las brochas esenciales son: brocha para base o esponja tipo beauty blender, brocha cónica para corrector, brocha para rubor o bronzer, brocha de difuminado para sombras, brocha plana para sombra de color y delineadora para cejas. Lava tus brochas al menos una vez por semana con champú suave o jabón de maquillaje para eliminar bacterias que pueden causar acné.",
  "La esponja tipo beauty blender se usa siempre húmeda, no mojada. Remójala en agua y exprímela bien hasta que no gotee. Aplica la base con movimientos de dab o goteo nunca arrastrando. La esponja húmeda hace que la base se vea más natural y se fusione mejor con la piel. Lávala con jabón neutro después de cada uso y déjala secar al aire.",
  "Para que el maquillaje dure más tiempo aplica prebase o primer antes de la base. Usa corrector y base de fórmula larga duración. Fija con polvo translúcido presionando con esponja especialmente en la zona T. Aplica spray fijador al terminar. Lleva blotting papers o papel matificante para retirar el exceso de grasa durante el día sin arruinar el maquillaje.",
  "Desmaquillarse correctamente es el paso más importante de la rutina nocturna. Usa un desmaquillante bifásico o aceite limpiador para disolver el maquillaje de ojos y labios antes del limpiador. Para los ojos aplica el desmaquillante en un disco de algodón, presiona sobre el párpado cerrado diez segundos y luego desliza hacia abajo sin frotar para no dañar las pestañas. Nunca uses agua micelar sola si usaste maquillaje de larga duración o resistente al agua.",
  "Para que el maquillaje dure un día entero en una boda o evento largo empieza con la piel bien hidratada y el primer adecuado para tu tipo de piel. Usa base de larga duración y fíjala con polvo. Para los ojos usa una base de sombras o primer de ojos. Fija las cejas con gel. Al terminar aplica dos capas de spray fijador. Lleva polvos matificantes y el labial para retoques puntuales."
];

// ============================================================
// MÓDULO 1: RETRIEVER — TF-IDF + Cosine Similarity
// ============================================================

// Stop-words en español
const STOPWORDS = new Set([
  "de","la","el","en","y","a","que","es","se","los","del","las","un","una","por",
  "con","para","su","al","lo","como","mas","pero","sus","le","ya","o","me","si",
  "no","este","esta","son","han","hay","ser","fue","eso","mi","tu","te","nos",
  "les","todo","bien","muy","aqui","ahi","igual","cuando","tambien","cada","pueden",
  "puede","tiene","tienen","hacer","solo","sobre","entre","desde","hasta","donde",
  "porque","aunque","sin","ante","bajo","contra","durante","hacia","mediante",
  "segun","tras","cual","cuales","como","estos","estas","esos","esas","uno","dos",
  "tres","otra","otro","otras","otros","mas","menos","tan","tanto","mucho","poco",
]);

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function computeTF(tokens) {
  const tf = {};
  tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
  const total = tokens.length || 1;
  Object.keys(tf).forEach((t) => { tf[t] = tf[t] / total; });
  return tf;
}

function computeIDF(docs) {
  const idf = {};
  const N = docs.length;
  docs.forEach((tokens) => {
    const seen = new Set(tokens);
    seen.forEach((t) => { idf[t] = (idf[t] || 0) + 1; });
  });
  Object.keys(idf).forEach((t) => {
    idf[t] = Math.log((N + 1) / (idf[t] + 1)) + 1;
  });
  return idf;
}

function tfidfVector(tf, idf) {
  const vec = {};
  Object.keys(tf).forEach((t) => {
    vec[t] = tf[t] * (idf[t] || 1);
  });
  return vec;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  Object.keys(vecA).forEach((t) => {
    dot += (vecA[t] || 0) * (vecB[t] || 0);
    normA += vecA[t] ** 2;
  });
  Object.keys(vecB).forEach((t) => { normB += vecB[t] ** 2; });
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Pre-construir el índice TF-IDF al cargar el módulo
const allTokenized = KNOWLEDGE_CHUNKS.map((chunk) => tokenize(chunk));
const idfScores = computeIDF(allTokenized);
const chunkIndex = KNOWLEDGE_CHUNKS.map((chunk, i) => ({
  vector: tfidfVector(computeTF(allTokenized[i]), idfScores),
  text: chunk,
}));

/**
 * Retriever: Recupera los Top-K chunks más relevantes para la query
 */
function retrieveTopK(query, k = 3) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const queryTF = computeTF(queryTokens);
  const queryVec = tfidfVector(queryTF, idfScores);

  const scored = chunkIndex.map((doc) => ({
    text: doc.text,
    score: cosineSimilarity(queryVec, doc.vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).filter((s) => s.score > 0.01);
}

// ============================================================
// MÓDULO 2: GENERATOR — Groq API (llama-3.3-70b-versatile)
// ============================================================

const SYSTEM_PROMPT = `Eres LuminaBot, la asesora de belleza virtual de Lumina Radiance — una tienda de cosméticos para el cuidado personal femenino.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con la información del CONTEXTO proporcionado. NO inventes datos, productos ni precios que no estén en el contexto.
2. Si el contexto no contiene información suficiente para responder, di amablemente que no tienes esa información y sugiere temas en los que sí puedes ayudar.
3. Usa un tono cálido, femenino, profesional y entusiasta. Usa emojis con moderación (1-3 por respuesta).
4. Estructura tus respuestas con formato claro: usa viñetas (•), negritas (**texto**) y saltos de línea para que sean fáciles de leer.
5. Las respuestas deben ser concisas pero informativas (máximo 150 palabras).
6. Siempre termina con una pregunta o invitación para continuar la conversación.
7. Si el usuario saluda, preséntate brevemente y ofrece ayuda.
8. Si el usuario se despide, despídete amablemente.`;

async function generateResponse(userMessage, contextChunks) {
  // Construir el contexto RAG
  let contextText = "No se encontró información relevante en la base de conocimiento.";
  if (contextChunks.length > 0) {
    contextText = contextChunks
      .map((c, i) => `[Fragmento ${i + 1}]: ${c.text}`)
      .join("\n\n");
  }

  const userPrompt = `CONTEXTO DE LA BASE DE CONOCIMIENTO:
${contextText}

PREGUNTA DEL USUARIO:
${userMessage}

Responde basándote estrictamente en el contexto proporcionado.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
      top_p: 0.9,
    });

    return chatCompletion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta. 🌸";
  } catch (error) {
    console.error("Error en Groq API:", error.message);
    throw new Error("Error al conectar con el servicio de IA.");
  }
}

// ============================================================
// ENDPOINT — Vercel Serverless Function
// ============================================================
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "El campo 'message' es requerido." });
  }

  const userMessage = message.trim();

  try {
    // PASO 1: RETRIEVER — Recuperar los Top 3 chunks más relevantes
    const topChunks = retrieveTopK(userMessage, 3);
    console.log(`📚 Retriever: ${topChunks.length} chunks recuperados para: "${userMessage}"`);
    topChunks.forEach((c, i) => console.log(`   [${i+1}] score=${c.score.toFixed(4)} — ${c.text.substring(0, 80)}...`));

    // PASO 2: GENERATOR — Generar respuesta con Groq
    const reply = await generateResponse(userMessage, topChunks);
    console.log(`🤖 Generator: respuesta generada (${reply.length} chars)`);

    return res.status(200).json({
      reply,
      debug: {
        chunksUsed: topChunks.length,
        topScores: topChunks.map((c) => c.score.toFixed(4)),
      },
    });
  } catch (error) {
    console.error("❌ Error en RAG pipeline:", error.message);
    return res.status(500).json({
      reply: "Disculpa, tuve un problema al procesar tu pregunta. ¿Podrías intentarlo de nuevo? 🌸",
      error: error.message,
    });
  }
};
