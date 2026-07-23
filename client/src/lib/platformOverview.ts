/**
 * DMENSION PLATFORM OVERVIEW
 * Main public-facing description for sitemaps, SEO, and visitor discovery
 * Written for general audiences while preserving technical depth for specialists
 */

export const PLATFORM_HEADLINE = "Dmension Mathematical Universe";

export const PLATFORM_TAGLINE = "See the invisible patterns that connect everything";

export const PLATFORM_OVERVIEW = {
  simple: {
    title: "What Is Dmension?",
    content: `Imagine a magical library that contains over 2,300 different shapes found throughout nature, science, and the universe. From the spiral of a seashell to the structure of DNA, from snowflakes to black holes. Dmension lets anyone see and explore these shapes in 3D, spin them around, and understand how they work.`
  },
  
  whyItMatters: {
    title: "Why Does This Matter?",
    content: `Everything in nature follows mathematical patterns. The way a flower grows, how galaxies spin, how your heart beats. These are not random. They follow invisible rules written in the language of mathematics. Dmension makes these invisible patterns visible.`
  },
  
  futureVision: {
    title: "Where This Takes Us",
    sections: [
      {
        heading: "Understanding Life Itself",
        content: `The platform includes something called the "Universal Law of Information." In simple terms: everything in the universe, from atoms to plants to animals to human consciousness, follows a pattern of growing complexity. Simple things combine to make more complex things. Energy becomes atoms. Atoms become molecules. Molecules become cells. Cells become life. Life becomes awareness.`
      },
      {
        heading: "Connecting All Things",
        content: `The "Internet of Things" connects devices. But Dmension points toward something bigger: an "Internet of Beings." Not just connecting machines, but understanding how all living and non-living things share the same underlying patterns. A tree, a crystal, a brain wave, a galaxy. They all speak the same mathematical language.`
      },
      {
        heading: "Education Without Barriers",
        content: `A child in any country can now explore the same mathematical beauty that once required years of university study. You do not need to understand equations. You just look, touch, and learn.`
      },
      {
        heading: "The Future of Discovery",
        content: `When researchers can see patterns visually, they find connections they never noticed before. A pattern in biology might solve a problem in engineering. A shape from ancient geometry might improve modern medicine.`
      }
    ]
  },
  
  bigPicture: {
    title: "The Big Picture",
    content: `Dmension is not just a tool. It is a window into the hidden order of reality. It suggests that beneath the chaos of everyday life, there is a beautiful structure connecting everything. From the smallest particle to the largest galaxy. From the simplest plant to human consciousness. The future is not just about connecting devices. It is about understanding how everything, living and non-living, is already connected through mathematics. Dmension is a first step toward seeing that connection clearly.`
  }
};

export const GROWTH_OPPORTUNITIES = {
  beneficiaries: [
    {
      sector: "Schools and Universities",
      description: "Teachers struggle to explain invisible concepts. How do you show a child what an atom looks like? How do you explain the shape of a virus? Dmension turns abstract ideas into something you can see and touch. Every science classroom, every university lab could use this to make learning come alive."
    },
    {
      sector: "Museums and Science Centers",
      description: "Imagine walking into a museum and spinning a galaxy with your fingers. Or unfolding a 4D shape that exists beyond what your eyes normally see. Museums could offer visitors experiences that were impossible before. Learning becomes an adventure."
    },
    {
      sector: "Medical and Pharmaceutical Companies",
      description: "Doctors and researchers study proteins, DNA, and cell structures. These shapes determine whether a medicine works or fails. Dmension lets researchers see biological structures in new ways, potentially finding treatments faster."
    },
    {
      sector: "Architects and Designers",
      description: "Nature has already solved many design problems. The spiral of a shell is structurally perfect. The branching of trees is efficient. Designers who understand these patterns can create buildings, products, and art that work better and look more beautiful."
    },
    {
      sector: "Technology Companies",
      description: "Artificial intelligence learns patterns. Dmension contains thousands of mathematically precise patterns. Companies building AI could use this as training data. Companies building virtual reality could use these shapes to create more realistic digital worlds."
    },
    {
      sector: "Energy and Engineering Firms",
      description: "The platform includes thermal engineering shapes. How heat flows. How cooling systems work. Engineers designing power plants, data centers, or spacecraft could visualize complex systems before building them."
    },
    {
      sector: "Wellness and Meditation Apps",
      description: "The platform includes sacred geometry and chakra visualizations. Companies creating meditation or wellness applications could use these calming, meaningful patterns to enhance their products."
    },
    {
      sector: "Game and Entertainment Studios",
      description: "Video games and movies need endless variety of objects, creatures, and environments. Mathematical shapes provide infinite inspiration that looks natural because it follows the same rules as nature."
    }
  ],
  
  systemIntegrations: [
    "Educational platforms (online learning, tutoring apps)",
    "Scientific research databases",
    "3D printing services (export shapes directly to physical objects)",
    "Virtual and augmented reality systems",
    "Smart home and IoT visualization dashboards",
    "Healthcare imaging and diagnostic tools"
  ],
  
  targetAudiences: [
    { type: "Curious minds", description: "who want to understand how the world works" },
    { type: "Artists", description: "seeking inspiration from nature's patterns" },
    { type: "Parents", description: "who want their children to love learning" },
    { type: "Researchers", description: "looking for visual breakthroughs" },
    { type: "Spiritual seekers", description: "exploring the geometry of existence" },
    { type: "Entrepreneurs", description: "building the next generation of products" }
  ],
  
  biggerVision: `Every industry that touches science, design, education, or technology could benefit. As the world moves toward visual communication, 3D interfaces, and connected devices, having a universal language of shapes becomes essential. Dmension is not just a product. It is a foundation. Like a dictionary for the language of form itself. Whoever learns this language first will have an advantage in the world that is coming.`
};

export const SEO_DESCRIPTIONS = {
  homepage: {
    title: "Dmension Mathematical Universe | See the Invisible Patterns That Connect Everything",
    description: "Explore 2,300+ mathematical shapes in 3D. From atoms to galaxies, DNA to black holes. Dmension makes the invisible patterns of nature visible to everyone. No equations required.",
    keywords: ["mathematical visualization", "3D shapes", "science education", "nature patterns", "interactive learning", "STEM education", "mathematical universe"]
  },
  
  about: {
    title: "About Dmension | The Future of Mathematical Discovery",
    description: "Dmension is a window into the hidden order of reality. Everything in nature follows mathematical patterns. We make those patterns visible, touchable, and understandable.",
    keywords: ["mathematical education", "visual learning", "science visualization", "pattern discovery", "universal mathematics"]
  },
  
  opportunities: {
    title: "Dmension for Business | Education, Healthcare, Technology, Design",
    description: "Schools, museums, medical researchers, architects, game studios, and technology companies all benefit from seeing mathematical patterns. Discover how Dmension transforms industries.",
    keywords: ["educational technology", "scientific visualization", "business applications", "research tools", "design inspiration"]
  }
};

export function getFullOverviewText(): string {
  return `${PLATFORM_OVERVIEW.simple.content}

${PLATFORM_OVERVIEW.whyItMatters.content}

${PLATFORM_OVERVIEW.futureVision.sections.map(s => `${s.heading}: ${s.content}`).join('\n\n')}

${PLATFORM_OVERVIEW.bigPicture.content}`;
}

export function getOpportunitiesText(): string {
  return `${GROWTH_OPPORTUNITIES.beneficiaries.map(b => `${b.sector}: ${b.description}`).join('\n\n')}

${GROWTH_OPPORTUNITIES.biggerVision}`;
}

console.log("📖 Platform Overview loaded - Public-facing descriptions ready");
console.log("   🌐 SEO metadata for homepage, about, and opportunities");
console.log("   🎯 Growth opportunities for 8 industry sectors");
console.log("   👥 Target audiences defined for discovery");
