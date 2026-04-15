// ── Daily rotation helpers ────────────────────────────────────────
/** Returns an index that changes once per day, cycling through array length. */
export function getDayIndex(arrayLength: number): number {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % arrayLength;
}

/** Returns CEFR difficulty level based on streak count. */
export type Difficulty = 'B1' | 'B2' | 'C1' | 'C2';
export function getDifficulty(streak: number): Difficulty {
  if (streak >= 36) return 'C2';
  if (streak >= 21) return 'C1';
  if (streak >= 8)  return 'B2';
  return 'B1';
}

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  B1: '#3D7A5E',  // green
  B2: '#5B6BA8',  // blue
  C1: '#8A6F3E',  // gold
  C2: '#C96442',  // coral
};
export const DIFFICULTY_BG: Record<Difficulty, string> = {
  B1: '#EEF7F3',
  B2: '#EEF0FA',
  C1: '#FAF7F0',
  C2: '#FAF0EB',
};

// ── Types ─────────────────────────────────────────────────────────
export type QuestionType = 'MCQ' | 'TFNG' | 'MATCH';

export type Question = {
  id:      number;
  type:    QuestionType;
  text:    string;
  options?: string[];   // MCQ: A/B/C/D
  answer:  string;      // MCQ: 'A'|'B'|'C'|'D', TFNG: 'TRUE'|'FALSE'|'NOT GIVEN'
};

export type ReadingPassage = {
  id:        number;
  title:     string;
  topic:     string;
  passage:   string;
  questions: Question[];
};

export type ListeningScenario = {
  id:        number;
  title:     string;
  topic:     string;
  script:    string;
  questions: Question[];
};

export type Task1ChartSeries = { name: string; color: string; values: number[] };
export type Task1Chart = {
  id:         number;
  topic:      string;
  chartTitle: string;
  prompt:     string;
  chartType:  'bar' | 'line' | 'pie';
  xLabels:    string[];
  yAxisLabel: string;
  series:     Task1ChartSeries[];
};

export type Task2Prompt = {
  id:     number;
  topic:  string;
  prompt: string;
};

// ── Reading passages ──────────────────────────────────────────────
export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 1,
    topic: 'The Rise of Vertical Farming',
    title: 'The Rise of Vertical Farming',
    passage: `Vertical farming — the practice of growing crops in stacked layers inside controlled environments — is rapidly gaining traction as a potential solution to global food security challenges. Unlike conventional agriculture, vertical farms use LED lighting, hydroponic systems, and precise climate control to produce crops year-round regardless of external weather conditions.

Proponents argue that vertical farming uses up to 95% less water than traditional field farming through closed-loop irrigation systems that recycle runoff. Land usage is also dramatically reduced: a single hectare of vertical farm can theoretically match the output of dozens of conventional hectares. This efficiency makes vertical farming particularly attractive in densely populated urban centres where arable land is scarce.

Critics, however, highlight substantial drawbacks. The energy costs of running artificial lighting and climate systems are considerable. Studies suggest that lettuce grown in vertical farms produces roughly eight times more carbon emissions than field-grown lettuce in regions where electricity comes primarily from fossil fuels. This undermines the environmental credentials that proponents champion.

The economics are also challenging. Construction and equipment costs for large-scale vertical farms can run into tens of millions of dollars, and profitability remains elusive for many operators. Only crops with high market value and rapid turnover — leafy greens, herbs, strawberries — tend to justify the investment.

Research into more energy-efficient LED technology and the integration of renewable energy sources may shift this balance. Some urban farms have begun installing solar panels or purchasing wind power certificates to offset their electricity demands. As energy costs fall and technology matures, the viability of vertical farming for staple crops such as wheat and rice — currently impractical — may improve.

Governments in Singapore, Japan, and the Netherlands have invested heavily in vertical farming research, viewing it as a strategic hedge against supply chain disruptions. Whether the technology fulfils its promise at scale remains to be seen.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'What is the main purpose of the first paragraph?', options: ['A. To criticise vertical farming methods', 'B. To introduce vertical farming and its advantages', 'C. To compare two farming techniques', 'D. To explain hydroponic irrigation'], answer: 'B' },
      { id: 2, type: 'TFNG', text: 'Vertical farms use less water than conventional farms.', answer: 'TRUE' },
      { id: 3, type: 'TFNG', text: 'Vertical farming is more profitable than traditional farming.', answer: 'NOT GIVEN' },
      { id: 4, type: 'MCQ', text: 'Which crop type is most economically viable in vertical farms?', options: ['A. Wheat', 'B. Rice', 'C. Leafy greens', 'D. Corn'], answer: 'C' },
      { id: 5, type: 'TFNG', text: 'Lettuce grown vertically produces fewer carbon emissions than field-grown lettuce everywhere.', answer: 'FALSE' },
      { id: 6, type: 'MCQ', text: 'Why are governments investing in vertical farming research?', options: ['A. To reduce food prices', 'B. To protect against supply chain disruptions', 'C. To replace all traditional farming', 'D. To expand urban land use'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'Singapore has invested in vertical farming research.', answer: 'TRUE' },
    ],
  },
  {
    id: 2,
    topic: 'The Psychology of Decision Making',
    title: 'The Psychology of Decision Making',
    passage: `Every day, the average person makes thousands of decisions — from mundane choices like what to eat for breakfast to significant ones like career changes or financial investments. Psychologists and behavioural economists have devoted decades of study to understanding the cognitive processes that underlie human decision-making, revealing that humans are far less rational than classical economic models assumed.

The dual-process theory, popularised by Nobel laureate Daniel Kahneman, distinguishes between two modes of thinking. System 1 is fast, automatic, and intuitive — it operates below conscious awareness, drawing on pattern recognition and emotional responses. System 2 is slower, deliberate, and analytical — it engages when we tackle complex problems that require careful reasoning. Most everyday decisions are handled by System 1, which, while efficient, is prone to systematic errors known as cognitive biases.

Among the most studied biases is anchoring — the tendency to rely heavily on the first piece of information encountered when making judgements. In salary negotiations, for instance, the initial figure mentioned tends to pull the final settlement towards it, regardless of whether the anchor was reasonable. Similarly, the availability heuristic leads people to overestimate the probability of events that come easily to mind, such as plane crashes, while underestimating far more common dangers like heart disease.

Loss aversion, another well-documented phenomenon, describes the finding that losses are psychologically roughly twice as powerful as equivalent gains. This asymmetry explains why investors hold onto losing stocks far longer than rational analysis would suggest — the pain of realising a loss outweighs the benefit of reinvesting in a better opportunity.

Understanding these biases has practical applications. Financial institutions now design default savings options to exploit the status quo bias, automatically enrolting employees in pension schemes unless they actively opt out. Public health campaigns frame messages in terms of lives saved rather than deaths to capitalise on framing effects.`,
    questions: [
      { id: 1, type: 'TFNG', text: 'Classical economic models assumed humans were perfectly rational.', answer: 'TRUE' },
      { id: 2, type: 'MCQ', text: 'Which best describes System 1 thinking?', options: ['A. Slow and deliberate', 'B. Fast and intuitive', 'C. Analytical and logical', 'D. Conscious and careful'], answer: 'B' },
      { id: 3, type: 'TFNG', text: 'Daniel Kahneman developed dual-process theory alone.', answer: 'NOT GIVEN' },
      { id: 4, type: 'TFNG', text: 'The availability heuristic causes people to overestimate the frequency of dramatic events.', answer: 'TRUE' },
      { id: 5, type: 'MCQ', text: 'Loss aversion means that losses feel approximately how much worse than equivalent gains?', options: ['A. Equal', 'B. Half as bad', 'C. Twice as bad', 'D. Three times as bad'], answer: 'C' },
      { id: 6, type: 'MCQ', text: 'What practical application of status quo bias is mentioned?', options: ['A. Investment portfolio design', 'B. Automatic pension enrolment', 'C. Salary negotiation tactics', 'D. Public health framing'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'Cognitive biases can be completely eliminated with training.', answer: 'NOT GIVEN' },
    ],
  },
  {
    id: 3,
    topic: 'Ocean Plastic Solutions',
    title: 'Tackling the Ocean Plastic Crisis',
    passage: `An estimated 8 million tonnes of plastic enter the world's oceans every year, accumulating in vast gyres and washing ashore on even the most remote beaches. The ecological consequences — entanglement, ingestion, and the leaching of toxic chemicals — affect marine life at every trophic level, from zooplankton to whales. Addressing this crisis has spawned an entire industry of technological and policy solutions, each with distinct merits and limitations.

Ocean cleanup technologies have attracted significant media attention and investment. The Ocean Cleanup Project, founded by Dutch entrepreneur Boyan Slat, deploys floating barrier systems designed to concentrate surface plastic for collection. While the project has achieved some notable successes and generated valuable data, critics argue that tackling ocean plastic without addressing land-based sources is akin to mopping up a floor without turning off the tap. Studies suggest that over 80% of ocean plastic originates from rivers and coastal communities in developing countries, particularly in South and Southeast Asia.

Intercepting plastic at river mouths before it reaches the sea is therefore considered a more cost-effective strategy. Technologies such as the Interceptor — also developed by The Ocean Cleanup — use solar-powered conveyor systems to extract debris from rivers. Early deployments in Malaysia and Indonesia have shown promising results, removing hundreds of tonnes of waste per year.

Policy solutions are considered essential by most environmental scientists. Extended producer responsibility schemes require manufacturers to fund collection and recycling of their products at end of life, creating financial incentives to design for recyclability. Several European nations have implemented plastic bag levies with demonstrable reductions in usage.

The challenge of microplastics — particles smaller than 5 millimetres — presents a separate problem. These fragments, produced by the breakdown of larger items and shed by synthetic textiles during washing, penetrate marine food chains and have been detected in human bloodstreams. Current filtration technologies cannot cost-effectively remove microplastics at scale.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'How much plastic enters the oceans annually?', options: ['A. 4 million tonnes', 'B. 6 million tonnes', 'C. 8 million tonnes', 'D. 10 million tonnes'], answer: 'C' },
      { id: 2, type: 'TFNG', text: 'The majority of ocean plastic comes from ships at sea.', answer: 'FALSE' },
      { id: 3, type: 'TFNG', text: 'The Interceptor uses wind power to collect river debris.', answer: 'FALSE' },
      { id: 4, type: 'MCQ', text: 'What percentage of ocean plastic is estimated to originate from land-based sources?', options: ['A. Over 50%', 'B. Over 70%', 'C. Over 80%', 'D. Over 90%'], answer: 'C' },
      { id: 5, type: 'TFNG', text: 'Extended producer responsibility schemes have been widely adopted globally.', answer: 'NOT GIVEN' },
      { id: 6, type: 'MCQ', text: 'What is the size threshold for microplastics?', options: ['A. Less than 1mm', 'B. Less than 5mm', 'C. Less than 10mm', 'D. Less than 50mm'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'Microplastics have been found in human bloodstreams.', answer: 'TRUE' },
    ],
  },
  {
    id: 4,
    topic: 'The History of Writing Systems',
    title: 'The Evolution of Human Writing',
    passage: `Writing is among humanity's most consequential inventions — yet it was not invented once but multiple times, independently, across different civilisations. The earliest known writing system, Sumerian cuneiform, emerged in Mesopotamia around 3400 BCE, initially as a practical tool for recording grain quantities and livestock transactions. What began as pictographic scratches on clay tablets gradually evolved into a complex system of wedge-shaped marks capable of expressing abstract ideas, literature, and law.

Ancient Egyptian hieroglyphics developed around the same period, combining logographic, syllabic, and alphabetic elements in a system of remarkable sophistication. The hieroglyphic script was eventually joined by simpler cursive forms — hieratic and later demotic — for administrative and everyday use, demonstrating a recurring pattern of writing systems simplifying over time to meet practical demands.

The Phoenician alphabet, developed around 1050 BCE, represents a watershed moment in writing history. By reducing the complex syllabaries of earlier scripts to around 22 consonantal signs, the Phoenicians created a system that was significantly easier to learn and adapt. This alphabet spread through trade networks across the Mediterranean, spawning the Greek alphabet, which added vowel notation — a critical innovation — and subsequently the Latin, Cyrillic, and Arabic scripts that today serve billions of people.

East Asian writing systems followed a different evolutionary path. Chinese logographic characters, with origins dating to around 1250 BCE oracle bones, maintained their logographic nature through millennia, resisting simplification into alphabetic form. Japan later adapted Chinese characters into its own mixed writing system, incorporating both logographic kanji and two phonetic syllabaries, hiragana and katakana.

The digital age has introduced new pressures on writing systems: emoji, text abbreviations, and ideographic symbols represent novel forms of visual communication that some linguists argue constitute the early stages of new writing conventions.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'What was cuneiform originally used for?', options: ['A. Religious ceremonies', 'B. Recording transactions', 'C. Astronomical observations', 'D. Legal codes'], answer: 'B' },
      { id: 2, type: 'TFNG', text: 'Writing was invented in a single location and spread worldwide.', answer: 'FALSE' },
      { id: 3, type: 'TFNG', text: 'The Phoenician alphabet contained around 22 characters.', answer: 'TRUE' },
      { id: 4, type: 'MCQ', text: 'What critical innovation did the Greek alphabet introduce?', options: ['A. Pictographs', 'B. Cuneiform marks', 'C. Vowel notation', 'D. Syllabic signs'], answer: 'C' },
      { id: 5, type: 'TFNG', text: 'Chinese characters eventually simplified into an alphabetic form.', answer: 'FALSE' },
      { id: 6, type: 'MCQ', text: 'What is hiragana?', options: ['A. A Chinese logographic system', 'B. A Japanese phonetic syllabary', 'C. A Phoenician script', 'D. An Egyptian cursive form'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'The article suggests emoji may represent early new writing conventions.', answer: 'TRUE' },
    ],
  },
  {
    id: 5,
    topic: 'Climate Change and Migration',
    title: 'Climate Change and Human Migration',
    passage: `Climate change is reshaping patterns of human migration on a scale not seen since the post-war era. Rising sea levels, intensifying droughts, and more frequent extreme weather events are displacing communities across vulnerable regions, creating what demographers and policy experts call "climate migrants" — a category not currently recognised under international refugee law.

The World Bank estimates that by 2050, over 216 million people could be forced to move within their own countries due to climate impacts, with Sub-Saharan Africa, South Asia, and Latin America facing the highest internal displacement pressures. Coastal Bangladesh, where annual flooding regularly inundates low-lying farmland, has already witnessed large-scale rural-to-urban migration as farmers lose their livelihoods to saltwater intrusion.

The distinction between economic and climate migration is often blurred in practice. A farmer displaced by prolonged drought does not merely seek better economic opportunities — their productive capacity has been destroyed by environmental change. Yet international legal frameworks, anchored in the 1951 Refugee Convention, provide protection only for those fleeing persecution, leaving climate migrants without clear legal status or rights.

Pacific Island nations face an existential dimension to the climate migration question. Countries such as Tuvalu and Kiribati, with maximum elevations of only a few metres above sea level, risk complete inundation within decades. Their governments have begun negotiating agreements with Australia and New Zealand for planned relocation, raising profound questions about national identity, sovereignty, and cultural preservation.

Proponents of managed retreat — the deliberate, planned relocation of communities from high-risk areas — argue that earlier intervention reduces both human suffering and eventual costs. Critics counter that such programmes risk dismantling tight-knit communities and that the billions required for relocation should instead be directed toward aggressive emissions reduction.`,
    questions: [
      { id: 1, type: 'TFNG', text: 'Climate migrants are currently recognised under international refugee law.', answer: 'FALSE' },
      { id: 2, type: 'MCQ', text: 'According to the World Bank, how many people could face internal displacement by 2050?', options: ['A. Over 100 million', 'B. Over 150 million', 'C. Over 216 million', 'D. Over 300 million'], answer: 'C' },
      { id: 3, type: 'TFNG', text: 'The 1951 Refugee Convention explicitly covers climate migrants.', answer: 'FALSE' },
      { id: 4, type: 'MCQ', text: 'What problem does saltwater intrusion cause in Bangladesh?', options: ['A. Urban flooding', 'B. Destruction of farmland', 'C. Loss of drinking water', 'D. Industrial damage'], answer: 'B' },
      { id: 5, type: 'TFNG', text: 'Tuvalu\'s maximum elevation is only a few metres above sea level.', answer: 'TRUE' },
      { id: 6, type: 'TFNG', text: 'Managed retreat programmes have universal support among policy experts.', answer: 'FALSE' },
      { id: 7, type: 'MCQ', text: 'What do critics of managed retreat suggest should be prioritised instead?', options: ['A. Coastal defences', 'B. International aid', 'C. Emissions reduction', 'D. Legal reform'], answer: 'C' },
    ],
  },
  {
    id: 6,
    topic: 'Artificial Intelligence in Medicine',
    title: 'AI in Medicine: Promise and Peril',
    passage: `Artificial intelligence is transforming medicine at a pace that has outstripped regulatory frameworks and ethical guidelines. Machine learning models trained on millions of medical images can now detect certain cancers — particularly skin cancer and diabetic retinopathy — with accuracy matching or exceeding experienced clinicians. Natural language processing systems parse clinical notes at scale, identifying patients at elevated risk of conditions ranging from sepsis to suicide.

The potential benefits are significant. In resource-constrained settings where specialist doctors are scarce, AI diagnostic tools could democratise access to expert-level screening. A dermatology AI deployed on a smartphone could provide reliable skin cancer triage in rural communities thousands of kilometres from the nearest dermatologist. Similar logic applies to radiology: AI systems can pre-screen chest X-rays in high-volume settings, flagging urgent cases for immediate radiologist attention.

Yet concerns about algorithmic bias are serious and well-documented. When AI models are trained predominantly on data from one demographic group — as has historically been the case in clinical research — their performance degrades for underrepresented populations. Studies have found that sepsis prediction algorithms perform significantly worse for Black patients than white patients, reflecting disparities in the underlying training data.

The question of regulatory approval is equally contested. In some jurisdictions, AI medical devices are approved based on retrospective performance studies that may not reflect real-world deployment conditions. The US Food and Drug Administration has cleared hundreds of AI-enabled medical devices, yet critics argue that post-market surveillance mechanisms are inadequate to detect performance deterioration over time.

Patient autonomy raises a further dimension. When an AI system recommends a treatment path, does the patient have a right to know the basis of that recommendation? The opacity of deep learning models — sometimes described as "black boxes" — complicates informed consent processes.`,
    questions: [
      { id: 1, type: 'TFNG', text: 'AI can currently match clinicians in detecting all types of cancer.', answer: 'FALSE' },
      { id: 2, type: 'MCQ', text: 'Which condition is mentioned as one AI can help predict using clinical notes?', options: ['A. Diabetes', 'B. Sepsis', 'C. Heart failure', 'D. Asthma'], answer: 'B' },
      { id: 3, type: 'TFNG', text: 'Algorithmic bias is a recognised problem in AI medical systems.', answer: 'TRUE' },
      { id: 4, type: 'TFNG', text: 'AI diagnostic tools would be less useful in well-resourced hospitals.', answer: 'NOT GIVEN' },
      { id: 5, type: 'MCQ', text: 'What does "black box" refer to in this context?', options: ['A. Encrypted medical records', 'B. Opaque AI decision-making', 'C. Confidential clinical trials', 'D. Classified drug formulas'], answer: 'B' },
      { id: 6, type: 'MCQ', text: 'Which US body clears AI-enabled medical devices?', options: ['A. CDC', 'B. NIH', 'C. FDA', 'D. AMA'], answer: 'C' },
      { id: 7, type: 'TFNG', text: 'The article argues that current post-market surveillance is adequate.', answer: 'FALSE' },
    ],
  },
  {
    id: 7,
    topic: 'The Future of Urban Transport',
    title: 'Reimagining Urban Mobility',
    passage: `Cities around the world are grappling with the mounting costs of car-centric transport systems: traffic congestion, air pollution, road fatalities, and the vast tracts of urban land devoted to parking and road infrastructure. A confluence of technological advances — electrification, autonomous vehicles, shared mobility platforms, and micro-mobility — is opening new possibilities for redesigning urban movement, though significant barriers remain.

Electric vehicles (EVs) are the most commercially mature of these technologies. Several major cities have announced targets to ban internal combustion engine vehicles from city centres within the next decade. While EVs eliminate tailpipe emissions, their environmental credentials depend heavily on the source of electricity generation. In coal-dependent grids, EVs may produce comparable lifecycle emissions to efficient conventional vehicles.

Autonomous vehicles (AVs) have attracted enormous investment but have proved far more technically difficult than early proponents anticipated. The "last mile" problem — navigating complex, unpredictable urban environments with pedestrians, cyclists, and non-standardised infrastructure — has resisted solution at scale. Most current deployments operate in geofenced zones with specific road conditions.

Shared mobility — the pooling of trips through ride-hailing platforms — initially promised to reduce car ownership and congestion. Research has since suggested the opposite: in many cities, ride-hailing services have increased total vehicle kilometres travelled, cannibalising public transport and cycling trips without eliminating private car journeys.

Perhaps the most promising near-term shifts involve urban design rather than technology. Cities that have removed urban motorways and reallocated road space to cycling infrastructure, pedestrian zones, and public transport have seen measurable improvements in air quality, road safety, and even retail economic activity. Barcelona's "superblock" model, which restricts through traffic in residential grid sections, has inspired cities from New York to Paris.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'What is the "last mile" problem in autonomous vehicles?', options: ['A. Battery charging distances', 'B. Navigating complex urban environments', 'C. High production costs', 'D. Passenger safety concerns'], answer: 'B' },
      { id: 2, type: 'TFNG', text: 'Electric vehicles always produce fewer lifecycle emissions than conventional vehicles.', answer: 'FALSE' },
      { id: 3, type: 'TFNG', text: 'Ride-hailing services have consistently reduced car ownership in cities.', answer: 'FALSE' },
      { id: 4, type: 'MCQ', text: 'What is Barcelona\'s "superblock" model?', options: ['A. High-density residential towers', 'B. Restricting through traffic in residential areas', 'C. Underground public transport routes', 'D. Expanded motorway networks'], answer: 'B' },
      { id: 5, type: 'TFNG', text: 'Most autonomous vehicles currently operate across all road types.', answer: 'FALSE' },
      { id: 6, type: 'TFNG', text: 'Removing urban motorways has improved air quality in some cities.', answer: 'TRUE' },
      { id: 7, type: 'MCQ', text: 'What factor most determines the environmental benefit of electric vehicles?', options: ['A. Vehicle weight', 'B. Driving speed', 'C. Electricity source', 'D. Battery size'], answer: 'C' },
    ],
  },
  {
    id: 8,
    topic: 'Biodiversity Loss and Its Causes',
    title: 'The Biodiversity Crisis',
    passage: `Earth is currently experiencing its sixth mass extinction event — and unlike the five previous ones, this is driven not by asteroid strikes or volcanic eruptions but by a single species: Homo sapiens. Biodiversity loss has accelerated dramatically since the industrial revolution, with current extinction rates estimated to be one hundred to one thousand times higher than the natural background rate.

The primary drivers of biodiversity loss are interrelated and mutually reinforcing. Habitat destruction, most visibly in the form of tropical deforestation, eliminates the living environments species require for survival. Agriculture currently occupies roughly half of Earth's habitable land surface, with vast monocultures replacing complex ecosystems. The Amazon rainforest — often described as the "lungs of the Earth" for its role in carbon sequestration — has lost approximately 17% of its original cover to cattle ranching and soya cultivation.

Overexploitation through overfishing, bushmeat hunting, and the illegal wildlife trade compounds habitat pressures. The global fishing fleet removes an estimated 80 million tonnes of marine life annually, with many commercially important species now at a fraction of their historical population sizes. Illegal wildlife trafficking, valued at billions of dollars annually, drives targeted predation on iconic species including elephants, rhinos, and pangolins.

Climate change represents an increasingly significant driver of biodiversity loss. As temperature zones shift poleward and upward in elevation, species must adapt, migrate, or face local extinction. Coral reefs — which support approximately 25% of all marine species despite covering less than 1% of the ocean floor — are facing mass bleaching events at frequencies that prevent recovery.

Conservation biologists argue for an integrated approach combining protected areas, wildlife corridors, sustainable agriculture practices, and demand reduction for wildlife products. The concept of "rewilding" — reintroducing keystone species to restore ecological processes — has gained traction as a strategy for recovering degraded ecosystems.`,
    questions: [
      { id: 1, type: 'TFNG', text: 'The current extinction event is the first caused by human activity.', answer: 'NOT GIVEN' },
      { id: 2, type: 'MCQ', text: 'What percentage of habitable land does agriculture occupy?', options: ['A. About 25%', 'B. About 35%', 'C. About 50%', 'D. About 65%'], answer: 'C' },
      { id: 3, type: 'TFNG', text: 'The Amazon has lost about 17% of its original forest cover.', answer: 'TRUE' },
      { id: 4, type: 'TFNG', text: 'Coral reefs cover more than 5% of the ocean floor.', answer: 'FALSE' },
      { id: 5, type: 'MCQ', text: 'How much marine life does the global fishing fleet remove annually?', options: ['A. 40 million tonnes', 'B. 60 million tonnes', 'C. 80 million tonnes', 'D. 100 million tonnes'], answer: 'C' },
      { id: 6, type: 'MCQ', text: 'What does "rewilding" involve?', options: ['A. Banning all hunting', 'B. Reintroducing keystone species', 'C. Expanding marine protected areas', 'D. Reducing agricultural land'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'Coral reefs support approximately 25% of all marine species.', answer: 'TRUE' },
    ],
  },
  {
    id: 9,
    topic: 'The Economics of Remote Work',
    title: 'Remote Work: Reshaping the Economy',
    passage: `The COVID-19 pandemic forced an unprecedented experiment in remote work, with millions of knowledge workers shifting almost overnight from offices to home environments. Three years on, the results of this experiment are complex, contested, and reshaping labour markets, commercial real estate, and urban economies in ways that economists are still working to understand.

Productivity research presents a mixed picture. Early studies, many conducted during lockdowns, found that remote workers were as productive as or more productive than office-based counterparts. Critics noted, however, that lockdown studies captured an unusual period: employees working remotely while competitors, cafes, and social activities were closed. More recent research from Stanford economist Nicholas Bloom suggests a nuanced reality — fully remote work reduces productivity by around 10–20% compared to full office attendance for many roles, but hybrid arrangements (two to three days remote per week) show no measurable productivity penalty.

The implications for urban commercial real estate have been severe. Office vacancy rates in major cities including San Francisco, New York, and London have reached levels not seen since the 1990s. This has knock-on effects for city centre retail, hospitality, and transport networks that depend on commuter footfall.

Remote work has also triggered what geographers call "the great reshuffling" — migration from expensive urban cores to smaller cities and rural areas as workers, freed from daily commuting requirements, optimise for housing costs and quality of life. House prices in previously depressed coastal and rural regions have surged as urban professionals relocate.

The distributional effects are significant. Remote work is overwhelmingly a privilege of high-skilled, high-income workers in knowledge industries. Frontline workers in healthcare, retail, manufacturing, and logistics cannot work remotely, leading some economists to warn that the rise of remote work may deepen existing inequalities between professional and working classes.`,
    questions: [
      { id: 1, type: 'TFNG', text: 'Nicholas Bloom is an economist at Harvard University.', answer: 'FALSE' },
      { id: 2, type: 'MCQ', text: 'According to Bloom\'s research, hybrid work shows:', options: ['A. 10-20% productivity loss', 'B. No measurable productivity penalty', 'C. Significant productivity gains', 'D. Higher employee turnover'], answer: 'B' },
      { id: 3, type: 'TFNG', text: 'Fully remote work reduces productivity by 10-20% compared to full office work.', answer: 'TRUE' },
      { id: 4, type: 'TFNG', text: 'Remote work opportunities are equally available to all workers.', answer: 'FALSE' },
      { id: 5, type: 'MCQ', text: 'What term do geographers use for the migration away from urban centres?', options: ['A. Urban flight', 'B. The great reshuffling', 'C. Suburban expansion', 'D. Economic redistribution'], answer: 'B' },
      { id: 6, type: 'MCQ', text: 'Which workers are said to be UNABLE to work remotely?', options: ['A. Software engineers', 'B. Financial analysts', 'C. Healthcare workers', 'D. Graphic designers'], answer: 'C' },
      { id: 7, type: 'TFNG', text: 'Office vacancy rates in major cities are at their highest since the 1990s.', answer: 'TRUE' },
    ],
  },
  {
    id: 10,
    topic: 'Space Tourism: Challenges Ahead',
    title: 'The Space Tourism Frontier',
    passage: `The launch of commercial space tourism ventures by companies including SpaceX, Blue Origin, and Virgin Galactic has made orbital and suborbital space accessible to private citizens for the first time — at prices that currently restrict access to the ultra-wealthy. A Virgin Galactic seat sells for approximately $450,000, while SpaceX's Inspiration4 mission cost participants an estimated $200 million total. As with many transformative technologies, proponents expect costs to fall dramatically as the industry matures and scales.

The environmental implications of space tourism are a growing concern. Rocket launches emit black carbon soot particles directly into the upper stratosphere, where they are thought to persist for up to a decade and may contribute to ozone depletion. Research published in 2022 suggested that if space tourism reaches the scale of conventional aviation — an extremely optimistic projection — the resulting black carbon emissions could warm the stratosphere by 0.5 degrees Celsius. The sector currently lacks any regulatory framework for managing these emissions.

Safety remains a significant challenge. SpaceShipTwo, operated by Virgin Galactic, suffered a fatal accident in 2014 that killed one pilot and seriously injured another. The inherent risks of spaceflight — catastrophic mechanical failure, extreme g-forces, radiation exposure, and the challenge of re-entry — cannot be entirely engineered away. Participants are required to sign extensive liability waivers acknowledging these risks.

Regulatory frameworks for commercial spaceflight vary significantly across jurisdictions. In the United States, the Federal Aviation Administration (FAA) oversees launch licences but has limited authority over in-flight passenger safety — a regulatory gap that has attracted criticism. International frameworks are largely absent, raising questions about liability for accidents involving passengers of multiple nationalities.

Optimists envision a future where falling costs eventually make space tourism broadly accessible — a development that could transform humanity's relationship with Earth, fostering what the astronaut-philosopher overview effect describes as a profound sense of planetary perspective and responsibility.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'What was the approximate cost of a Virgin Galactic seat?', options: ['A. $100,000', 'B. $250,000', 'C. $450,000', 'D. $1,000,000'], answer: 'C' },
      { id: 2, type: 'TFNG', text: 'Black carbon particles from rockets persist in the stratosphere for up to a decade.', answer: 'TRUE' },
      { id: 3, type: 'TFNG', text: 'The FAA has full authority over in-flight passenger safety for commercial spaceflight.', answer: 'FALSE' },
      { id: 4, type: 'MCQ', text: 'What happened to SpaceShipTwo in 2014?', options: ['A. It completed its first successful flight', 'B. It suffered a fatal accident', 'C. It was retired from service', 'D. It was sold to SpaceX'], answer: 'B' },
      { id: 5, type: 'TFNG', text: 'There is currently a comprehensive international regulatory framework for space tourism.', answer: 'FALSE' },
      { id: 6, type: 'MCQ', text: 'What does the "overview effect" refer to?', options: ['A. A space navigation system', 'B. A regulatory inspection procedure', 'C. A profound sense of planetary perspective', 'D. An astronomical observation technique'], answer: 'C' },
      { id: 7, type: 'TFNG', text: 'Space tourism currently emits as much carbon as conventional aviation.', answer: 'FALSE' },
    ],
  },
];

// ── Listening scenarios ───────────────────────────────────────────
export const LISTENING_SCENARIOS: ListeningScenario[] = [
  {
    id: 1,
    topic: 'Restaurant Booking Conversation',
    title: 'Restaurant Booking',
    script: `[Phone ringing]
Staff: Good evening, La Maison restaurant. How can I help you?
Customer: Hi, I'd like to make a reservation for Saturday evening, please.
Staff: Certainly. How many people will be dining?
Customer: There will be four of us — two adults and two children.
Staff: And what time were you thinking?
Customer: Around 7:30 if possible.
Staff: Let me check. We do have a table available at 7:30. Could I take your name?
Customer: Yes, it's Chen. C-H-E-N.
Staff: Perfect, Mr Chen. And a contact number?
Customer: 07891 234567.
Staff: Excellent. I should mention that we have a set menu on Saturday evenings for £45 per adult and £20 for children under 12. Alternatively, you can order from our full à la carte menu.
Customer: We'll probably go with the à la carte. One of our guests has a nut allergy — is that something you can accommodate?
Staff: Absolutely. Please remind your server when you arrive and we'll ensure all dishes are prepared safely. Is there anything else?
Customer: Yes, could we have a table near the window if possible?
Staff: I'll do my best to arrange that, though I can't guarantee it on a busy evening. I'll add it as a preference to your booking.
Customer: That's fine. One more thing — is there parking nearby?
Staff: There's a pay-and-display car park on Brook Street, about two minutes' walk away. It operates until midnight on weekends.
Customer: Perfect. Thank you very much.
Staff: Our pleasure. We look forward to seeing you Saturday at 7:30. Goodbye.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'How many people is the reservation for?', options: ['A. Two adults', 'B. Three adults and one child', 'C. Two adults and two children', 'D. Four adults'], answer: 'C' },
      { id: 2, type: 'MCQ', text: 'What time is the reservation?', options: ['A. 7:00 pm', 'B. 7:15 pm', 'C. 7:30 pm', 'D. 8:00 pm'], answer: 'C' },
      { id: 3, type: 'TFNG', text: 'The customer\'s name is spelled C-H-E-N.', answer: 'TRUE' },
      { id: 4, type: 'MCQ', text: 'What is the set menu price for adults on Saturday evenings?', options: ['A. £35', 'B. £40', 'C. £45', 'D. £50'], answer: 'C' },
      { id: 5, type: 'MCQ', text: 'What dietary requirement does one guest have?', options: ['A. Gluten intolerance', 'B. Nut allergy', 'C. Dairy-free diet', 'D. Vegetarian'], answer: 'B' },
      { id: 6, type: 'TFNG', text: 'The restaurant guarantees a window table for the customer.', answer: 'FALSE' },
      { id: 7, type: 'MCQ', text: 'Until what time does the car park operate on weekends?', options: ['A. 10:00 pm', 'B. 11:00 pm', 'C. Midnight', 'D. 1:00 am'], answer: 'C' },
      { id: 8, type: 'MCQ', text: 'How far is the car park from the restaurant?', options: ['A. One minute', 'B. Two minutes', 'C. Five minutes', 'D. Ten minutes'], answer: 'B' },
      { id: 9, type: 'TFNG', text: 'The children\'s set menu costs the same as the adult menu.', answer: 'FALSE' },
      { id: 10, type: 'MCQ', text: 'What does the customer ultimately decide about the menu?', options: ['A. The set menu', 'B. The à la carte menu', 'C. No decision made', 'D. A tasting menu'], answer: 'B' },
    ],
  },
  {
    id: 2,
    topic: 'University Enrollment Discussion',
    title: 'University Enrollment',
    script: `Advisor: Come in! You must be here about registration for next semester?
Student: Yes, I'm Marcus Webb. I emailed last week about changing my modules.
Advisor: Ah yes, Marcus. Sit down. So you want to drop Advanced Statistics and pick up something else?
Student: That's right. It's just too time-intensive alongside my dissertation.
Advisor: I understand. Have you looked at the module catalogue?
Student: I was thinking about Research Methods in Social Sciences or possibly the Data Visualisation elective.
Advisor: Both are good choices. Research Methods runs on Tuesday and Thursday mornings, 10 to 12. Data Visualisation is Wednesday afternoons, 2 to 5.
Student: The Wednesday slot would work better. Does it have a practical component?
Advisor: It does — about 40% of your mark comes from a portfolio of visualisation projects. The rest is a final written report.
Student: That sounds manageable. What software do they use?
Advisor: Primarily R and Tableau. Some students also use Python. I'd say at least basic familiarity with R helps.
Student: I've done an introductory R course, so that should be fine. Is there a reading list?
Advisor: The module guide is on the student portal. The key textbook is "The Visual Display of Quantitative Information" by Edward Tufte.
Student: I'll order that. One concern — I'm already enrolled in the Business Ethics seminar that meets Wednesday afternoon.
Advisor: You'd need to withdraw from that if you take Data Visualisation. There's a 5pm deadline on Friday to make changes without a penalty.
Student: I'll decide by Thursday. Could you note my interest in the Data Visualisation module in case a space fills?
Advisor: I can flag you as a priority enrolment. The module has capacity for 35 students and currently has 28 registered.
Student: That's reassuring. Thank you for your help.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'Why does Marcus want to change modules?', options: ['A. He dislikes the subject', 'B. It conflicts with his schedule', 'C. It is too time-intensive alongside his dissertation', 'D. The lecturer is unavailable'], answer: 'C' },
      { id: 2, type: 'MCQ', text: 'When does Data Visualisation run?', options: ['A. Tuesday and Thursday mornings', 'B. Monday afternoons', 'C. Wednesday afternoons', 'D. Friday mornings'], answer: 'C' },
      { id: 3, type: 'MCQ', text: 'What percentage of the Data Visualisation mark comes from portfolio projects?', options: ['A. 30%', 'B. 40%', 'C. 50%', 'D. 60%'], answer: 'B' },
      { id: 4, type: 'TFNG', text: 'Marcus has no previous experience with R.', answer: 'FALSE' },
      { id: 5, type: 'MCQ', text: 'What is the key textbook for the module?', options: ['A. "Data Science for Beginners"', 'B. "The Visual Display of Quantitative Information"', 'C. "Applied Statistics with R"', 'D. "Business Intelligence Fundamentals"'], answer: 'B' },
      { id: 6, type: 'MCQ', text: 'What is the deadline to make module changes without penalty?', options: ['A. Thursday 5pm', 'B. Friday 5pm', 'C. Monday 9am', 'D. Wednesday noon'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'The Data Visualisation module is already full.', answer: 'FALSE' },
      { id: 8, type: 'MCQ', text: 'How many students are currently registered for Data Visualisation?', options: ['A. 25', 'B. 28', 'C. 32', 'D. 35'], answer: 'B' },
      { id: 9, type: 'TFNG', text: 'Marcus would need to leave Business Ethics to take Data Visualisation.', answer: 'TRUE' },
      { id: 10, type: 'MCQ', text: 'What does the advisor agree to do for Marcus?', options: ['A. Reserve a guaranteed spot', 'B. Contact the module leader', 'C. Flag him as a priority enrolment', 'D. Waive the deadline'], answer: 'C' },
    ],
  },
  {
    id: 3, topic: 'Museum Audio Guide Tour', title: 'Museum Audio Tour',
    script: `Welcome to the National History Museum's audio guide for the Ancient Civilisations gallery. I'm your guide for this tour, which covers highlights from our Mesopotamian and Egyptian collections. Please note that photography is permitted throughout the gallery, but flash photography is not allowed near the fragile textile exhibits in Room 4.

We begin in the main atrium, where you can see the centrepiece of our Mesopotamian collection: a reconstructed Sumerian ziggurat model, built to one-fiftieth scale and based on excavations at the site of Ur in modern-day Iraq. The original structure, dedicated to the moon god Nanna, was built around 2100 BCE and originally stood over 30 metres tall.

As you move through the archway into Room 1, notice the display case on your left. This contains a collection of cuneiform tablets — among the oldest examples of writing in the world. The tablets on the top shelf date from approximately 3000 BCE and record grain transactions in what was essentially an early accounting system. The tablet in the centre of the case is a fragment of the Epic of Gilgamesh, one of humanity's earliest literary works.

Continuing to Room 2, you encounter our Egyptian mummification exhibit. The mummy displayed here is Amenhotep-Ra, a minor official who lived during the New Kingdom period, approximately 1350 BCE. Analysis of his remains indicates he was approximately 45 years old at death and suffered from arthritis in his lower spine.

Room 3 contains our jewellery and ornament collection, featuring gold artefacts from both civilisations. Please be aware that this room closes 30 minutes before the rest of the gallery.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'Where is flash photography NOT permitted?', options: ['A. The main atrium', 'B. Room 1', 'C. Room 4', 'D. The entrance hall'], answer: 'C' },
      { id: 2, type: 'MCQ', text: 'To what scale is the ziggurat model built?', options: ['A. 1:25', 'B. 1:50', 'C. 1:100', 'D. 1:200'], answer: 'B' },
      { id: 3, type: 'TFNG', text: 'The ziggurat was dedicated to a sun god.', answer: 'FALSE' },
      { id: 4, type: 'MCQ', text: 'The cuneiform tablets on the top shelf date from approximately:', options: ['A. 2100 BCE', 'B. 2500 BCE', 'C. 3000 BCE', 'D. 3500 BCE'], answer: 'C' },
      { id: 5, type: 'TFNG', text: 'The Epic of Gilgamesh fragment is in the centre of the display case.', answer: 'TRUE' },
      { id: 6, type: 'MCQ', text: 'Approximately how old was Amenhotep-Ra when he died?', options: ['A. 35', 'B. 40', 'C. 45', 'D. 50'], answer: 'C' },
      { id: 7, type: 'TFNG', text: 'Amenhotep-Ra was a senior government official.', answer: 'FALSE' },
      { id: 8, type: 'MCQ', text: 'What medical condition did analysis of Amenhotep-Ra reveal?', options: ['A. Heart disease', 'B. Arthritis in his lower spine', 'C. Dental decay', 'D. A broken leg'], answer: 'B' },
      { id: 9, type: 'MCQ', text: 'When does Room 3 close?', options: ['A. At the same time as the rest of the gallery', 'B. 15 minutes before the rest', 'C. 30 minutes before the rest', 'D. One hour before the rest'], answer: 'C' },
      { id: 10, type: 'TFNG', text: 'Room 3 contains artefacts from both Mesopotamian and Egyptian civilisations.', answer: 'TRUE' },
    ],
  },
  {
    id: 4, topic: 'Job Interview Preparation', title: 'Job Interview Coaching',
    script: `Coach: So, Sarah, you've got your interview at Meridian Technologies next Thursday. Let's run through some preparation.
Sarah: Thanks, I'm particularly nervous about the competency questions.
Coach: That's normal. Use the STAR method — Situation, Task, Action, Result. Every answer should follow that structure.
Sarah: Could you give me an example?
Coach: Sure. "Tell me about a time you managed a difficult team situation." You'd describe the situation briefly, the specific task you faced, the actions you took — and this is the most important part — then quantify the result. Not "things improved" but "team productivity increased by 25%".
Sarah: What if I don't have exact figures?
Coach: Approximate is fine — "approximately" or "around" signals you're being honest. What you want to avoid is vague claims with nothing behind them.
Sarah: What about the question "Where do you see yourself in five years?"
Coach: Don't say "in your role" — even if you think it. Frame it around growing with the company. Something like: "I want to develop into a senior technical role and ideally take on some project leadership responsibility. Meridian's focus on innovation aligns with where I want to build my expertise."
Sarah: That sounds much better than what I had.
Coach: Research the company thoroughly — recent news, their values, their clients. They'll likely ask "Why Meridian?" and your answer needs to reference specifics.
Sarah: What should I wear?
Coach: Business professional — you can't go wrong. Arrive 10 minutes early, have printed copies of your CV, and prepare three thoughtful questions to ask them.
Sarah: What kind of questions?
Coach: About the team culture, growth opportunities, or what success looks like in this role in the first 90 days. Avoid asking about salary in the first interview.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'What does the STAR method stand for?', options: ['A. Summary, Theme, Achievement, Review', 'B. Situation, Task, Action, Result', 'C. Strategy, Target, Analysis, Report', 'D. Structure, Time, Assessment, Response'], answer: 'B' },
      { id: 2, type: 'TFNG', text: 'The coach says exact figures are essential in competency answers.', answer: 'FALSE' },
      { id: 3, type: 'MCQ', text: 'What should Sarah avoid saying in response to "Where do you see yourself in five years?"', options: ['A. Mentioning leadership goals', 'B. Referencing the company\'s values', 'C. Saying "in your role"', 'D. Discussing technical skills'], answer: 'C' },
      { id: 4, type: 'TFNG', text: 'Sarah\'s interview is on Thursday.', answer: 'TRUE' },
      { id: 5, type: 'MCQ', text: 'How many printed copies of her CV should Sarah bring?', options: ['A. One', 'B. Two', 'C. Three', 'D. The number is not specified, just "printed copies"'], answer: 'D' },
      { id: 6, type: 'MCQ', text: 'How early should Sarah arrive?', options: ['A. 5 minutes', 'B. 10 minutes', 'C. 15 minutes', 'D. 20 minutes'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'Sarah should ask about salary in the first interview.', answer: 'FALSE' },
      { id: 8, type: 'MCQ', text: 'Which type of question does the coach recommend asking the interviewer?', options: ['A. Questions about competitor companies', 'B. Questions about what success looks like in the first 90 days', 'C. Questions about the CEO\'s background', 'D. Questions about the company\'s financial performance'], answer: 'B' },
      { id: 9, type: 'TFNG', text: 'The coach advises business casual attire.', answer: 'FALSE' },
      { id: 10, type: 'MCQ', text: 'Why should Sarah research the company before the interview?', options: ['A. To impress with general knowledge', 'B. To answer "Why Meridian?" with specifics', 'C. To negotiate a higher salary', 'D. To identify weaknesses in the company'], answer: 'B' },
    ],
  },
  {
    id: 5, topic: 'Travel Agency Consultation', title: 'Travel Agency',
    script: `Agent: Welcome to Horizon Travel. How can I help you today?
Client: I'm hoping to plan a two-week holiday in Japan in April. It's my first time.
Agent: Wonderful choice — April is cherry blossom season, which is spectacular but very popular. You'll need to book well in advance. Have you thought about which cities you'd like to visit?
Client: I definitely want Tokyo and Kyoto. Maybe Osaka too?
Agent: That's a classic itinerary — Tokyo, Shinkansen to Kyoto, then Osaka on the way back or vice versa. With two weeks you could also include Hiroshima and Nara as day trips.
Client: How much is the bullet train between cities?
Agent: A Japan Rail Pass covers unlimited Shinkansen travel. A 14-day pass costs approximately £500 per person and is essential for a trip like this. You must purchase it before you arrive in Japan.
Client: What about accommodation?
Agent: Tokyo and Kyoto in April will be expensive — cherry blossom season pushes prices up by 30 to 50%. I'd recommend a mix: try at least one or two nights in a traditional ryokan inn for the cultural experience, but budget hotels or Airbnb for the rest.
Client: Do I need to sort out currency?
Agent: Japan is still largely cash-based, especially outside Tokyo. I'd recommend exchanging at least ¥50,000 before you travel. Post office ATMs are the most reliable for foreign cards.
Client: Is Japanese necessary?
Agent: Not at all in major cities, though locals really appreciate basic phrases. Download Google Translate with the Japanese offline pack — the camera feature that translates menus in real time is invaluable.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'Why is April a popular time to visit Japan?', options: ['A. Summer festivals', 'B. Cherry blossom season', 'C. Low tourist numbers', 'D. Mild weather'], answer: 'B' },
      { id: 2, type: 'MCQ', text: 'What is the approximate cost of a 14-day Japan Rail Pass?', options: ['A. £300', 'B. £400', 'C. £500', 'D. £600'], answer: 'C' },
      { id: 3, type: 'TFNG', text: 'The Japan Rail Pass can be purchased on arrival in Japan.', answer: 'FALSE' },
      { id: 4, type: 'MCQ', text: 'By how much do accommodation prices increase during cherry blossom season?', options: ['A. 10-20%', 'B. 20-30%', 'C. 30-50%', 'D. 50-70%'], answer: 'C' },
      { id: 5, type: 'TFNG', text: 'The agent recommends staying exclusively in traditional ryokan inns.', answer: 'FALSE' },
      { id: 6, type: 'MCQ', text: 'How much cash does the agent recommend exchanging before travel?', options: ['A. ¥20,000', 'B. ¥30,000', 'C. ¥50,000', 'D. ¥100,000'], answer: 'C' },
      { id: 7, type: 'MCQ', text: 'Which ATMs are described as most reliable for foreign cards?', options: ['A. Bank ATMs', 'B. Post office ATMs', 'C. Airport ATMs', 'D. Hotel ATMs'], answer: 'B' },
      { id: 8, type: 'TFNG', text: 'Fluency in Japanese is required to travel in major cities.', answer: 'FALSE' },
      { id: 9, type: 'MCQ', text: 'What feature of Google Translate does the agent recommend?', options: ['A. Voice translation', 'B. Text conversation mode', 'C. Camera menu translation', 'D. Offline dictionary'], answer: 'C' },
      { id: 10, type: 'TFNG', text: 'The client has visited Japan before.', answer: 'FALSE' },
    ],
  },
  {
    id: 6, topic: 'Doctor Appointment Conversation', title: 'Doctor Appointment',
    script: `Doctor: Good morning, Mrs Patel. What brings you in today?
Patient: I've had a persistent cough for about three weeks now. It started after a cold but just won't go away.
Doctor: Is the cough dry or are you bringing anything up?
Patient: Mostly dry, but occasionally I get some clear mucus. Nothing coloured.
Doctor: Any fever, shortness of breath, or chest pain?
Patient: No fever. Some mild breathlessness when I climb stairs quickly, but that's been the same for years.
Doctor: Have you taken anything for it?
Patient: Just over-the-counter cough syrup, which doesn't really help.
Doctor: Let me listen to your chest. [pause] Everything sounds clear. Do you smoke?
Patient: I gave up 15 years ago. I smoked for about ten years before that.
Doctor: Good. Given your history, I'd like to do a chest X-ray as a precaution. It's almost certainly a post-viral cough — these can persist for four to six weeks — but better to rule out anything else.
Patient: That sounds sensible. Should I be worried?
Doctor: I wouldn't be concerned, but it's good practice. I'll also prescribe a short course of a steroid inhaler to help calm the airway inflammation. Use it twice a day for two weeks.
Patient: Any side effects?
Doctor: At this low dose, minimal — you might notice a slightly dry mouth. Rinse your mouth after each use.
Patient: When should I come back?
Doctor: If the X-ray is clear, the cough should resolve within the next few weeks. If it persists beyond six weeks from onset or worsens, come back sooner.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'How long has the patient had her cough?', options: ['A. One week', 'B. Two weeks', 'C. Three weeks', 'D. Four weeks'], answer: 'C' },
      { id: 2, type: 'TFNG', text: 'The patient\'s cough produces coloured mucus.', answer: 'FALSE' },
      { id: 3, type: 'TFNG', text: 'The patient currently smokes.', answer: 'FALSE' },
      { id: 4, type: 'MCQ', text: 'For how long did the patient smoke before quitting?', options: ['A. Five years', 'B. Eight years', 'C. Ten years', 'D. Fifteen years'], answer: 'C' },
      { id: 5, type: 'MCQ', text: 'What test does the doctor order as a precaution?', options: ['A. Blood test', 'B. CT scan', 'C. Chest X-ray', 'D. Lung function test'], answer: 'C' },
      { id: 6, type: 'MCQ', text: 'How should the steroid inhaler be used?', options: ['A. Once a day for a week', 'B. Twice a day for two weeks', 'C. Three times a day for one week', 'D. Once a day for a month'], answer: 'B' },
      { id: 7, type: 'TFNG', text: 'The doctor identifies a serious abnormality when listening to the chest.', answer: 'FALSE' },
      { id: 8, type: 'MCQ', text: 'What side effect might the patient notice?', options: ['A. Nausea', 'B. Headache', 'C. Slightly dry mouth', 'D. Dizziness'], answer: 'C' },
      { id: 9, type: 'MCQ', text: 'How long might a post-viral cough persist according to the doctor?', options: ['A. Two to three weeks', 'B. Four to six weeks', 'C. Six to eight weeks', 'D. Eight to ten weeks'], answer: 'B' },
      { id: 10, type: 'TFNG', text: 'The doctor advises the patient to return immediately if the cough continues.', answer: 'FALSE' },
    ],
  },
  {
    id: 7, topic: 'Library Orientation Talk', title: 'Library Orientation',
    script: `Librarian: Welcome everyone to the Hartfield University Library orientation. I'm going to run through the key services and facilities available to you as students. Please hold questions until the end.

First, your student card acts as your library card. You can borrow up to 20 items at a time for standard undergraduate borrowing. Postgraduate students get 40 items. The standard loan period is three weeks, renewable twice online through your account portal. If an item is reserved by another user, you'll receive an email notification that you must return it within one week.

We have four floors. The ground floor is the social learning area — it's designed for group work and discussion, so noise is expected. Floors one to three are for individual silent study. Please note that food and hot drinks are only permitted on the ground floor. Water bottles are allowed everywhere.

Printing and scanning facilities are on every floor. You receive 200 pages of free printing per semester — colour printing uses four credits per page and black-and-white uses one. The photo scanning booth on floor two handles documents up to A1 size.

The library is open 24 hours during term time, staffed from 8am to 10pm. After 10pm, security staff are available but library assistance is limited to self-service machines. During the examination period, we add additional silent study seats — watch the library website for announcements.

Inter-library loan allows you to request items not held at this library from partner institutions. Requests typically take five to seven working days and there is no charge for standard requests.

We have subject librarians for each faculty — their contact details and appointment booking links are on our website. I'd strongly recommend booking a one-to-one session in your first few weeks.`,
    questions: [
      { id: 1, type: 'MCQ', text: 'How many items can an undergraduate student borrow at once?', options: ['A. 10', 'B. 15', 'C. 20', 'D. 40'], answer: 'C' },
      { id: 2, type: 'MCQ', text: 'How many times can a loan be renewed?', options: ['A. Once', 'B. Twice', 'C. Three times', 'D. Unlimited'], answer: 'B' },
      { id: 3, type: 'MCQ', text: 'Where is group work and discussion permitted?', options: ['A. All floors', 'B. Floors one to three', 'C. The ground floor only', 'D. Floor two'], answer: 'C' },
      { id: 4, type: 'TFNG', text: 'Hot drinks are permitted on all floors.', answer: 'FALSE' },
      { id: 5, type: 'MCQ', text: 'How many free printing pages are allocated per semester?', options: ['A. 100', 'B. 150', 'C. 200', 'D. 250'], answer: 'C' },
      { id: 6, type: 'MCQ', text: 'How many credits does a colour print use?', options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'], answer: 'D' },
      { id: 7, type: 'TFNG', text: 'The library is staffed 24 hours during term time.', answer: 'FALSE' },
      { id: 8, type: 'MCQ', text: 'Where is the photo scanning booth?', options: ['A. Ground floor', 'B. Floor one', 'C. Floor two', 'D. Floor three'], answer: 'C' },
      { id: 9, type: 'MCQ', text: 'How long do inter-library loan requests typically take?', options: ['A. One to two days', 'B. Three to four days', 'C. Five to seven days', 'D. Ten to fourteen days'], answer: 'C' },
      { id: 10, type: 'TFNG', text: 'There is a charge for standard inter-library loan requests.', answer: 'FALSE' },
    ],
  },
  {
    id: 8, topic: 'City Council Meeting Discussion', title: 'City Council Meeting',
    script: `Chair: The meeting is called to order. The main agenda item this evening is the proposed redevelopment of Riverside Park. We have two presentations — first from the developer, Halcyon Properties, and then from the residents' coalition. Mr Dawson from Halcyon.

Mr Dawson: Thank you, Councillor. The Halcyon proposal involves constructing 240 residential units on the eastern section of Riverside Park, retaining 65% of the green space, and adding a renovated playground and new café facility. The development would generate an estimated 180 construction jobs and contribute £2.3 million annually in council tax revenue.

Chair: Thank you. Ms Okafor, representing the residents' coalition.

Ms Okafor: We appreciate the economic points raised, but I must point out that this park is one of only three significant green spaces within two kilometres. The 240 units would house approximately 480 residents — yet the park in its current form already serves over 6,000 weekly users. The eastern section that would be built on contains a protected wildlife area with three species of conservation concern. The planning application does not mention this at all.

Chair: Can you clarify that point about the wildlife area?

Ms Okafor: The eastern meadow was designated a Site of Special Interest by the county council in 2019. Any development there would require an Environmental Impact Assessment under Section 42 of the Planning Act.

Mr Dawson: We were not made aware of this designation. We would be willing to commission the required assessment before proceeding.

Chair: The council will need to verify the designation status before any vote proceeds. We'll table this item to the next session pending a report from the planning department. Is that agreed?

[General agreement from councillors]`,
    questions: [
      { id: 1, type: 'MCQ', text: 'How many residential units are proposed?', options: ['A. 180', 'B. 200', 'C. 240', 'D. 280'], answer: 'C' },
      { id: 2, type: 'MCQ', text: 'What percentage of green space would be retained?', options: ['A. 55%', 'B. 65%', 'C. 70%', 'D. 75%'], answer: 'B' },
      { id: 3, type: 'TFNG', text: 'The development would generate £2.3 million in council tax revenue annually.', answer: 'TRUE' },
      { id: 4, type: 'MCQ', text: 'How many weekly users does the park currently serve?', options: ['A. 2,000', 'B. 4,000', 'C. 6,000', 'D. 8,000'], answer: 'C' },
      { id: 5, type: 'TFNG', text: 'The developer\'s application mentions the wildlife designation.', answer: 'FALSE' },
      { id: 6, type: 'MCQ', text: 'When was the eastern meadow designated a Site of Special Interest?', options: ['A. 2015', 'B. 2017', 'C. 2019', 'D. 2021'], answer: 'C' },
      { id: 7, type: 'TFNG', text: 'The developer agrees to commission an Environmental Impact Assessment.', answer: 'TRUE' },
      { id: 8, type: 'MCQ', text: 'What action does the Chair decide to take?', options: ['A. Vote on the proposal immediately', 'B. Reject the proposal outright', 'C. Table the item pending a planning report', 'D. Request a public consultation'], answer: 'C' },
      { id: 9, type: 'MCQ', text: 'How many construction jobs would the development generate?', options: ['A. 120', 'B. 150', 'C. 180', 'D. 240'], answer: 'C' },
      { id: 10, type: 'TFNG', text: 'Riverside Park is one of only three significant green spaces within two kilometres.', answer: 'TRUE' },
    ],
  },
];

// ── Writing Task 1 charts ─────────────────────────────────────────
export const TASK1_CHARTS: Task1Chart[] = [
  {
    id: 1,
    topic: 'Internet Access by Country',
    chartTitle: 'Internet access by country (% of population)',
    prompt: 'The bar chart below shows the percentage of the population with internet access in five countries in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartType: 'bar',
    xLabels: ['USA', 'UK', 'Germany', 'Brazil', 'India'],
    yAxisLabel: '% population',
    series: [
      { name: '2000', color: '#D97757', values: [43, 26, 30, 3, 1] },
      { name: '2020', color: '#5B6BA8', values: [89, 96, 91, 74, 50] },
    ],
  },
  {
    id: 2,
    topic: 'Coffee Consumption Trends',
    chartTitle: 'Annual coffee consumption per capita (kg)',
    prompt: 'The line chart below shows the average annual coffee consumption per capita in four countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartType: 'bar',
    xLabels: ['2000', '2005', '2010', '2015', '2020'],
    yAxisLabel: 'kg per capita',
    series: [
      { name: 'Finland', color: '#D97757', values: [11, 12, 12, 13, 14] },
      { name: 'USA', color: '#5B6BA8', values: [4, 4, 5, 5, 5] },
      { name: 'Brazil', color: '#3D7A5E', values: [5, 5, 6, 6, 7] },
      { name: 'China', color: '#8A6F3E', values: [0, 0, 1, 2, 3] },
    ],
  },
  {
    id: 3,
    topic: 'Energy Sources Comparison',
    chartTitle: 'Electricity generation by source (%)',
    prompt: 'The bar chart shows the proportion of electricity generated from different energy sources in two countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartType: 'bar',
    xLabels: ['Coal', 'Gas', 'Nuclear', 'Hydro', 'Wind/Solar'],
    yAxisLabel: '% of total',
    series: [
      { name: 'Country A', color: '#D97757', values: [40, 25, 20, 5, 10] },
      { name: 'Country B', color: '#5B6BA8', values: [5, 10, 35, 30, 20] },
    ],
  },
  {
    id: 4,
    topic: 'Population Growth by Continent',
    chartTitle: 'Population growth 1990–2020 (millions added)',
    prompt: 'The bar chart shows the population increase in millions for five world regions between 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartType: 'bar',
    xLabels: ['Africa', 'Asia', 'Americas', 'Europe', 'Oceania'],
    yAxisLabel: 'Millions added',
    series: [
      { name: '1990–2005', color: '#D97757', values: [300, 800, 120, 30, 8] },
      { name: '2005–2020', color: '#5B6BA8', values: [500, 700, 100, 20, 10] },
    ],
  },
  {
    id: 5,
    topic: 'Tourism Statistics',
    chartTitle: 'International tourist arrivals (millions)',
    prompt: 'The chart below shows the number of international tourist arrivals in five destinations over a 20-year period. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartType: 'bar',
    xLabels: ['France', 'Spain', 'USA', 'China', 'Italy'],
    yAxisLabel: 'Millions',
    series: [
      { name: '2000', color: '#D97757', values: [77, 47, 51, 31, 41] },
      { name: '2019', color: '#5B6BA8', values: [89, 83, 79, 66, 64] },
    ],
  },
  {
    id: 6,
    topic: 'Employment by Sector',
    chartTitle: 'Employment by sector (% of workforce)',
    prompt: 'The bar chart illustrates the proportion of the workforce employed in three major sectors in four countries. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartType: 'bar',
    xLabels: ['Agriculture', 'Industry', 'Services'],
    yAxisLabel: '% workforce',
    series: [
      { name: 'Country A', color: '#D97757', values: [5, 20, 75] },
      { name: 'Country B', color: '#5B6BA8', values: [30, 25, 45] },
      { name: 'Country C', color: '#3D7A5E', values: [55, 20, 25] },
    ],
  },
];

// ── Writing Task 2 prompts ────────────────────────────────────────
export const TASK2_PROMPTS: Task2Prompt[] = [
  {
    id: 1,
    topic: 'Technology and Learning',
    prompt: 'Some people believe technology has made it easier to learn new skills, while others think it has actually made people lazier and less likely to develop real abilities. Discuss both views and give your own opinion.',
  },
  {
    id: 2,
    topic: 'Social Media and Society',
    prompt: 'Social media has transformed how people communicate and consume information. Some argue this has had a predominantly positive impact on society, while others believe the negative effects outweigh the benefits. Discuss both sides and give your opinion.',
  },
  {
    id: 3,
    topic: 'Urban vs Rural Living',
    prompt: 'In many countries, young people are increasingly choosing to live in cities rather than rural areas. What are the advantages and disadvantages of this trend? Do you think governments should encourage people to move to rural areas?',
  },
  {
    id: 4,
    topic: 'Climate Change Responsibility',
    prompt: 'Some people think that addressing climate change is primarily the responsibility of governments and large corporations, while others believe that individuals must change their behaviour first. Discuss both views and give your own opinion.',
  },
  {
    id: 5,
    topic: 'Education Systems',
    prompt: 'In some countries, schools focus heavily on academic achievement and examinations. Others believe that practical skills and emotional intelligence are equally important. What do you think schools should prioritise? Give reasons for your answer.',
  },
  {
    id: 6,
    topic: 'Work-Life Balance',
    prompt: 'Modern working practices, including remote work and flexible hours, have changed the relationship between employees and their employers. Some argue this has improved work-life balance; others say it has blurred the boundaries between work and personal life unhealthily. Discuss both views.',
  },
  {
    id: 7,
    topic: 'Tourism Benefits and Drawbacks',
    prompt: 'International tourism brings significant economic benefits to host countries but also creates problems for local communities and the environment. To what extent do the benefits of tourism outweigh the drawbacks? Give reasons for your answer.',
  },
  {
    id: 8,
    topic: 'AI and Employment',
    prompt: 'Artificial intelligence and automation are transforming workplaces, with some experts predicting that many jobs will be replaced by machines within decades. Do you think this development is more beneficial or harmful for society? Give reasons and examples.',
  },
  {
    id: 9,
    topic: 'Health and Lifestyle',
    prompt: 'Governments in many countries have introduced taxes on unhealthy foods and beverages such as sugary drinks and processed snacks. Some people support this approach, while others believe it infringes on individual freedom. What is your view?',
  },
  {
    id: 10,
    topic: 'Cultural Preservation vs Globalisation',
    prompt: 'Globalisation has led to greater cultural exchange but also threatens the survival of minority languages and local traditions. Some argue this cultural homogenisation is inevitable and even beneficial. Others believe local cultures must be actively preserved. Discuss both views.',
  },
];

// ── Daily content getters ─────────────────────────────────────────
export function getTodaysReading(): ReadingPassage {
  return READING_PASSAGES[getDayIndex(READING_PASSAGES.length)];
}

export function getTodaysListening(): ListeningScenario {
  return LISTENING_SCENARIOS[getDayIndex(LISTENING_SCENARIOS.length)];
}

export function getTodaysTask1(): Task1Chart {
  return TASK1_CHARTS[getDayIndex(TASK1_CHARTS.length)];
}

export function getTodaysTask2(): Task2Prompt {
  return TASK2_PROMPTS[getDayIndex(TASK2_PROMPTS.length)];
}

/** Module name + content for the library screen */
export type LibraryItem = {
  module:      'reading' | 'listening' | 'writing_task1' | 'writing_task2';
  id:          number;
  title:       string;
  topic:       string;
  dayIndex:    number;
  isToday:     boolean;
};

export function getAllLibraryItems(): LibraryItem[] {
  const todayReadingIdx    = getDayIndex(READING_PASSAGES.length);
  const todayListeningIdx  = getDayIndex(LISTENING_SCENARIOS.length);
  const todayTask1Idx      = getDayIndex(TASK1_CHARTS.length);
  const todayTask2Idx      = getDayIndex(TASK2_PROMPTS.length);

  const items: LibraryItem[] = [
    ...READING_PASSAGES.map((p, i) => ({
      module:   'reading' as const,
      id:       p.id,
      title:    p.title,
      topic:    p.topic,
      dayIndex: i + 1,
      isToday:  i === todayReadingIdx,
    })),
    ...LISTENING_SCENARIOS.map((s, i) => ({
      module:   'listening' as const,
      id:       s.id,
      title:    s.title,
      topic:    s.topic,
      dayIndex: i + 1,
      isToday:  i === todayListeningIdx,
    })),
    ...TASK1_CHARTS.map((c, i) => ({
      module:   'writing_task1' as const,
      id:       c.id,
      title:    c.chartTitle,
      topic:    c.topic,
      dayIndex: i + 1,
      isToday:  i === todayTask1Idx,
    })),
    ...TASK2_PROMPTS.map((p, i) => ({
      module:   'writing_task2' as const,
      id:       p.id,
      title:    p.topic,
      topic:    p.topic,
      dayIndex: i + 1,
      isToday:  i === todayTask2Idx,
    })),
  ];

  return items;
}
