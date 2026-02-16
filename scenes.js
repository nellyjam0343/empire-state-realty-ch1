window.ALL_SCENES = {

// ===== CHAPTER 1: LICENSE LAW (9 scenes) =====
1: [
  {
    day: 1, title: "The Offer", location: "Grand Concourse, The Bronx",
    narrative: [
      {speaker:"narrator", text:"Monday morning. You step off the D train at 161st Street, coffee in hand, heart pounding. Today you start at Concourse Realty \u2014 your first job in real estate."},
      {speaker:"marcus", text:"\"Welcome to the team.\" Marcus Rivera \u2014 your new broker \u2014 shakes your hand at the door of a narrow office above a bodega. \"Before we do anything, we gotta get something straight.\""},
      {speaker:"marcus", text:"\"You're not my employee. You're an Independent Contractor. That's a big deal \u2014 it changes everything about how this works.\""},
    ],
    learn: { title: "Independent Contractor vs. Employee", emoji: "\ud83d\udccb",
      cards: [
        {title:"You're a 1099, Not a W-2", text:"As an Independent Contractor, you get a <b>1099 Misc</b> at tax time \u2014 not a W-2. The IRS calls you a <b>\"statutory non-employee independent contractor.\"</b>"},
        {title:"No Benefits. Period.", text:"No health insurance. No 401K. No vacation days. No sick pay. You earn only what you close."},
        {title:"Supervised, Not Dictated", text:"Your broker can <b>supervise and guide</b> you \u2014 but they <b>cannot dictate</b> your schedule, methods, or hours."},
        {title:"The IC Agreement", text:"You'll sign an Independent Contractor Relationship Agreement with your broker. It must be <b>reviewed every 12 to 15 months</b>."},
      ]
    },
    challenge: { setup: "Marcus slides a stack of paperwork across the desk. \"Sign here, here, and here. Oh \u2014 and make sure you file correctly at tax time.\"",
      q: "At the end of the year, which tax form will you receive as a real estate agent?",
      a: ["W-2 \u2014 I'm on Marcus's payroll", "1099 Misc \u2014 I'm an independent contractor", "W-4 \u2014 standard withholding form", "1040 \u2014 personal income tax"],
      correct: 1, why: "You get a 1099 Misc because you're an Independent Contractor \u2014 NOT an employee.",
      right: "\"Good. You already know more than my last hire. Let's keep going.\"",
      wrong: "\"Nah \u2014 you're not on my payroll. You're a 1099. Independent Contractor. Remember that.\""
    }
  },
  {
    day: 1, title: "The Credentials", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Marcus pulls your license application from a folder and holds it up."},
      {speaker:"marcus", text:"\"This little piece of paper took you 77 hours of class time, a $15 exam fee, and a state exam to earn. And it cost you $65 to apply for. Don't take it lightly.\""},
      {speaker:"marcus", text:"\"The Department of State \u2014 DOS \u2014 they issued this. They run everything. Licensing, complaints, disciplinary actions. DOS is your boss, not me.\""},
    ],
    learn: { title: "Getting Your License", emoji: "\ud83c\udf93",
      cards: [
        {title: "The 77-Hour Course", text: "You must complete a <b>77-hour approved course</b> before taking the state exam. Broker requires 77 + 75 = <b>152 hours total.</b>"},
        {title: "The Costs", text: "<b>$15</b> to reserve your exam seat. <b>$65</b> for the Salesperson license (valid 2 years). Broker license: <b>$185</b> for 2 years."},
        {title: "Age Requirements", text: "Salesperson: minimum <b>18 years old.</b> Broker or Associate Broker: minimum <b>20 years old.</b>"},
        {title: "DOS Runs Everything", text: "The <b>NYS Department of State (DOS)</b>, Division of Licensing Services issues all real estate licenses in New York."},
      ]
    },
    challenge: { setup: "A young woman walks in asking about getting her license. Marcus nudges you \u2014 \"This one's yours.\"",
      q: "How many classroom hours do I need to become a Salesperson in New York?",
      a: ["45 hours", "77 hours", "120 hours", "152 hours"],
      correct: 1, why: "The NYS Salesperson course is 77 hours. 152 is the total for Broker (77 + 75).",
      right: "\"Perfect. You've got the details down.\"",
      wrong: "\"Not quite \u2014 it's 77 hours for the Salesperson course.\""
    }
  },
  {
    day: 2, title: "Meet the Team", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Tuesday. Marcus introduces you to the office."},
      {speaker:"marcus", text:"\"This is Denise. She's our Associate Broker \u2014 passed the Broker exam, could run her own shop, but she likes it here.\""},
      {speaker:"denise", text:"\"Welcome. Quick tip \u2014 I see new agents confuse the license types all the time. Let me break it down.\""},
    ],
    learn: { title: "Types of Licenses", emoji: "\ud83c\udfc5",
      cards: [
        {title: "Associate Broker", text: "Passed the Broker exam and <b>IS a Broker</b> \u2014 but chooses to work under another broker. Has <b>no broker powers</b> within the office."},
        {title: "6 Types of Broker Licenses", text: "<b>Individual, Associate, Trade Name, Partnership, Corporate, and LLC/LLP.</b> Six flavors, one exam."},
        {title: "Dual License", text: "A Salesperson CAN work for <b>two competing brokers</b> \u2014 called a Dual License. Both brokers must sign <b>'no objection' letters</b> to DOS."},
        {title: "Salesperson \u2260 Office Manager", text: "A Salesperson <b>cannot</b> be an office manager. You need at minimum an <b>Associate Broker</b> license."},
      ]
    },
    challenge: { setup: "A rival agent pops in. \"I heard your new agent is gonna manage the office while you're on vacation.\"",
      q: "Can a Salesperson serve as the office manager?",
      a: ["Yes, if the broker approves", "Yes, after 2 years of experience", "No \u2014 you need at least an Associate Broker license", "Yes, but only temporarily"],
      correct: 2, why: "A Salesperson can NEVER be an office manager. You need an Associate Broker license.",
      right: "\"Exactly. That's why Denise is here. You'll get there.\"",
      wrong: "\"Nope \u2014 you'd need to be at least an Associate Broker for that.\""
    }
  },
  {
    day: 3, title: "The Rules", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Wednesday. Quiet morning. Marcus drops a thick binder on your desk."},
      {speaker:"marcus", text:"\"License Law. You need to know this cold. Your license is good for 2 years. To renew, you need 22.5 hours of continuing education. And you keep records for 3 years.\""},
    ],
    learn: { title: "License Law \u2014 The Rules", emoji: "\u2696\ufe0f",
      cards: [
        {title: "2-Year License", text: "Every NYS real estate license is valid for <b>2 years</b>, then must be renewed."},
        {title: "22.5 CE Hours to Renew", text: "<b>Fair Housing</b> (3 hrs), <b>Agency</b> (1-2 hrs), <b>Ethics</b> (3.75 hrs), <b>Cultural Competency</b> (2 hrs), <b>Implicit Bias</b> (2 hrs). Total: <b>22.5 hours</b>."},
        {title: "3-Year Record Keeping", text: "You must keep records of each transaction for <b>3 years</b> after the deal closes."},
        {title: "5 Business Days", text: "If your name, status, or office address changes, notify DOS within <b>5 business days.</b>"},
        {title: "Felony = Denied", text: "A felony conviction means your license application is <b>denied</b> \u2014 unless you've been <b>pardoned by the Court.</b>"},
      ]
    },
    challenge: { setup: "Marcus quizzes you before lunch. \"Quick \u2014 you close a deal today. How long do you keep the paperwork?\"",
      q: "How long must a licensee maintain records of each transaction?",
      a: ["1 year", "2 years", "3 years", "5 years"],
      correct: 2, why: "3 years. That's the law.",
      right: "\"Three years. Good. Some agents think it's just til closing. Those agents get fined.\"",
      wrong: "\"Three years. Write it on your hand if you have to.\""
    }
  },
  {
    day: 3, title: "The First Listing", location: "Tremont Ave, The Bronx",
    narrative: [
      {speaker:"narrator", text:"After lunch, Marcus takes you to your first listing appointment."},
      {speaker:"marcus", text:"\"The seller fills out the Property Conditions Disclosure Form at listing time. We hand it to the buyer when they're ready to make an offer.\""},
    ],
    learn: { title: "Disclosures & Advertising", emoji: "\ud83d\udcdd",
      cards: [
        {title: "Property Condition Disclosure", text: "Seller fills this out at <b>listing time.</b> Given to buyer <b>when ready to make an offer.</b>"},
        {title: "Blind Ads Are Illegal", text: "An ad without the broker's name is a <b>Blind Ad.</b> It violates License Law."},
        {title: "Ads Must Include Broker Info", text: "Every real estate ad must include the <b>broker's name</b> and be honest."},
      ]
    },
    challenge: { setup: "A potential buyer calls. \"When do I get the disclosure form?\"",
      q: "When is the Property Condition Disclosure Form given to the buyer?",
      a: ["At the first open house", "When they're ready to make an offer", "At the closing table", "Within 48 hours of listing"],
      correct: 1, why: "The disclosure form goes to the buyer when they're ready to make an offer.",
      right: "\"Nailed it. She's putting in an offer tomorrow.\"",
      wrong: "\"It's when they're ready to offer. Too early is premature, too late is a violation.\""
    }
  },
  {
    day: 4, title: "The Attorney Question", location: "Bronx County Courthouse",
    narrative: [
      {speaker:"narrator", text:"Thursday. Marcus sends you to the courthouse. You run into an attorney handling real estate deals for 20 years."},
      {speaker:"narrator", text:"\"I don't have a real estate license,\" the attorney says with a grin. \"Don't need one.\""},
    ],
    learn: { title: "License Exemptions", emoji: "\ud83d\udd13",
      cards: [
        {title: "Who Doesn't Need a License?", text: "Exempt: <b>Attorneys</b>, building superintendents, court-appointed personnel, property owners (selling their own), public officers, tenant associations."},
        {title: "Who DOES Need One?", text: "Property managers, real estate assistants who show properties, part-time agents \u2014 all <b>must</b> be licensed."},
      ]
    },
    challenge: { setup: "A friend calls. \"My uncle's a lawyer and he's been selling houses. Is that legal?\"",
      q: "Which of these people does NOT need a real estate license?",
      a: ["Property managers", "Assistants who show properties", "Attorneys", "Part-time agents"],
      correct: 2, why: "Attorneys are exempt from real estate licensing in NYS.",
      right: "\"Attorneys play by different rules. Good \u2014 you're learning.\"",
      wrong: "\"Attorneys are exempt. Know your exemptions.\""
    }
  },
  {
    day: 4, title: "The Annual Review", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Back at the office, Denise flags you down."},
      {speaker:"denise", text:"\"Your IC Agreement is due for review in about 13 months. It's not a sign-and-forget thing.\""},
    ],
    learn: { title: "The IC Agreement Deep Dive", emoji: "\ud83d\udcd1",
      cards: [
        {title: "Review Every 12\u201315 Months", text: "The IC Agreement must be <b>reviewed every 12 to 15 months.</b> Not re-signed \u2014 reviewed."},
        {title: "What Makes You an IC?", text: "You control your own schedule. You pay your own taxes. Your broker <b>supervises</b> but does not <b>dictate.</b>"},
        {title: "Cross the Line = Employee", text: "If your broker dictates your schedule or tells you exactly how to work \u2014 you may legally become an <b>Employee</b>."},
      ]
    },
    challenge: { setup: "Denise looks at you. \"Quick \u2014 how often does the IC Agreement need to be reviewed?\"",
      q: "How frequently must the Independent Contractor Relationship Agreement be reviewed?",
      a: ["Every 6 months", "Every 12 to 15 months", "Every 2 years at license renewal", "Only at initial signing"],
      correct: 1, why: "Every 12 to 15 months.",
      right: "\"Denise runs a tight ship. Glad you're keeping up.\"",
      wrong: "\"12 to 15 months. That's why we put it on the calendar.\""
    }
  },
  {
    day: 5, title: "The Emergency", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Friday morning. The mood is heavy. Denise meets you at the door."},
      {speaker:"denise", text:"\"Marcus had a medical emergency last night. He's stable, but he can't work. We need to talk about what happens.\""},
    ],
    learn: { title: "When a Broker Can't Continue", emoji: "\ud83d\udea8",
      cards: [
        {title: "Broker Death or Incapacity", text: "If a broker dies or can't continue, <b>DOS will appoint a Full Broker or Attorney</b> to manage temporarily."},
        {title: "Pending Deals Still Close", text: "The appointed person's job: <b>close out all pending transactions</b>."},
        {title: "Then What?", text: "After pending deals close, the <b>license is terminated</b> and all agents must find a new broker."},
      ]
    },
    challenge: { setup: "Another agent panics. \"If Marcus can't come back, do we all just stop working?\"",
      q: "If a broker dies or is permanently incapacitated, what happens?",
      a: ["All agents must immediately stop working", "DOS appoints a broker or attorney to close pending deals", "The top-selling agent takes over", "The office automatically closes"],
      correct: 1, why: "DOS steps in and appoints a Full Broker or Attorney to close pending transactions.",
      right: "\"That's exactly right. The system protects the agents and the clients.\"",
      wrong: "\"DOS appoints someone to close everything out properly.\""
    }
  },
  {
    day: 5, title: "The Dream", location: "Grand Concourse \u2014 Rooftop",
    narrative: [
      {speaker:"narrator", text:"Friday evening. Marcus called from the hospital \u2014 he'll be back Monday. You sit on the rooftop. Yankee Stadium glows in the distance."},
      {speaker:"narrator", text:"Someday, this could be YOUR office. But first \u2014 the broker exam."},
    ],
    learn: { title: "The Path to Broker", emoji: "\ud83c\udf1f",
      cards: [
        {title: "Broker Qualifying \u2014 Option 1", text: "<b>2 years full-time</b> (35 hrs/week) as a licensed Salesperson + <b>3,500 points</b> from transactions."},
        {title: "Broker Qualifying \u2014 Option 2", text: "<b>3 years full-time</b> + <b>5,250 points</b> \u2014 includes property management experience."},
        {title: "The Costs & Requirements", text: "Broker license: <b>$185 for 2 years.</b> Minimum age: <b>20.</b> Total education: <b>152 hours</b>."},
        {title: "Continuing Ed", text: "Every 2 years, complete <b>22.5 hours of CE</b>."},
      ]
    },
    challenge: { setup: "Marcus calls from the hospital. \"One more question before your weekend.\"",
      q: "To qualify for a Broker license through sales experience, you need:",
      a: ["1 year full-time & 2,000 points", "2 years full-time & 3,500 points", "3 years full-time & 5,000 points", "5 years & 7,500 points"],
      correct: 1, why: "2 years full-time (35 hrs/week) and 3,500 points from transactions.",
      right: "\"You're gonna be running your own shop before you know it.\"",
      wrong: "\"Two years, 3,500 points. That's the benchmark.\""
    }
  },
],

// ===== CHAPTER 2: LAW OF AGENCY (3 scenes) =====
2: [
  { day: 6, title: "Who's Got Your Back?", location: "Bronx County Courthouse Area",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise meet a couple browsing listings outside a Fordham Road brokerage." },
      { speaker: "marcus", text: "There's a big difference between being a customer and being a client." },
      { speaker: "denise", text: "A customer gets fair dealing, but no loyalty. A client gets a fiduciary relationship." },
      { speaker: "marcus", text: "We remember our fiduciary duties with OLD CAR: Obedience, Loyalty, Disclosure, Confidentiality, Accountability, and Reasonable Care." },
      { speaker: "denise", text: "And before any first substantive contact, we must give an Agent Disclosure Form." }
    ],
    learn: { title: "Customer vs. Client", emoji: "\ud83e\udd1d",
      cards: [
        { title: "Customer vs. Client", text: "A <b>customer</b> receives honest dealing but <b>no fiduciary loyalty</b>. A <b>client</b> has an agency relationship with full fiduciary duties." },
        { title: "OLD CAR", text: "<b>O</b>bedience, <b>L</b>oyalty, <b>D</b>isclosure, <b>C</b>onfidentiality, <b>A</b>ccountability, <b>R</b>easonable Care" },
        { title: "Agent Disclosure Form", text: "Must be provided at the <b>first substantive contact</b> with a prospective buyer or seller." }
      ]
    },
    challenge: { setup: "A buyer walks into your open house asking about the seller's motivation.",
      q: "Before answering, what must you provide at this first substantive contact?",
      a: ["A copy of the purchase contract", "An Agent Disclosure Form", "A mortgage pre-approval letter", "Your business card"],
      correct: 1, why: "NY law requires an Agent Disclosure Form at first substantive contact.",
      right: "\"Exactly. That disclosure form goes in her hands first.\"",
      wrong: "\"Before any real conversation, we need that Agent Disclosure Form.\""
    }
  },
  { day: 6, title: "Agents & Dual Trouble", location: "Arthur Avenue, Belmont",
    narrative: [
      { speaker: "narrator", text: "Over espresso on Arthur Avenue, Marcus explains the agency hierarchy." },
      { speaker: "marcus", text: "The broker is the agent of the client. The salesperson is a sub-agent of the broker." },
      { speaker: "marcus", text: "Compensation does NOT determine agency. And dual agency requires informed written consent from both parties." },
      { speaker: "marcus", text: "Three types of agents: Universal does all acts, General handles business affairs, Special is for one transaction." }
    ],
    learn: { title: "Agency Relationships", emoji: "\ud83c\udfe2",
      cards: [
        { title: "Broker vs. Salesperson", text: "The <b>broker</b> is the agent of the client. The <b>salesperson</b> is a <b>sub-agent</b> under the broker." },
        { title: "Compensation \u2260 Agency", text: "<b>Compensation does NOT determine agency.</b> Agency is created by agreement, not by payment." },
        { title: "Dual Agency", text: "Legal in NY <b>only</b> with <b>informed written consent</b> from both parties." },
        { title: "Agent Types", text: "<b>Universal</b> \u2014 all acts<br><b>General</b> \u2014 business acts<br><b>Special</b> \u2014 one transaction" }
      ]
    },
    challenge: { setup: "A buyer wants you to represent them on a property you listed. Both parties are willing.",
      q: "What is required for dual agency?",
      a: ["Verbal agreement from buyer", "Informed written consent from both parties", "Approval from DOS", "A dual agency fee"],
      correct: 1, why: "Dual agency requires informed written consent from BOTH parties.",
      right: "\"Both sides sign off in writing or you can't play both sides.\"",
      wrong: "\"Dual agency needs informed written consent from BOTH parties.\""
    }
  },
  { day: 7, title: "The Price Is Negotiable", location: "Yankee Stadium Concourse",
    narrative: [
      { speaker: "narrator", text: "Walking past Yankee Stadium, Marcus overhears brokers discussing commission rates." },
      { speaker: "marcus", text: "Agreeing on a set commission rate is price fixing \u2014 a per se violation of the Sherman Antitrust Act." },
      { speaker: "marcus", text: "Refusing to work with a discount broker? Group boycott \u2014 also per se. Commission is ALWAYS negotiable. Kickbacks are illegal." }
    ],
    learn: { title: "Antitrust & Commissions", emoji: "\u2696\ufe0f",
      cards: [
        { title: "Sherman Antitrust Act", text: "Two key violations: <b>price fixing</b> and <b>group boycotts</b> \u2014 both <b>per se</b> (no defense)." },
        { title: "Commission Rules", text: "Commissions are <b>ALWAYS negotiable</b>. There is no standard rate." },
        { title: "Kickbacks", text: "<b>Kickbacks</b> for referrals in real estate are <b>illegal</b>." }
      ]
    },
    challenge: { setup: "A broker says: 'We should all agree to charge 6%.'",
      q: "What violation is this?",
      a: ["A licensing violation", "A per se violation \u2014 price fixing", "An ethical violation only", "A RESPA violation"],
      correct: 1, why: "Price fixing is a per se violation of the Sherman Antitrust Act.",
      right: "\"Price fixing. Walk away immediately.\"",
      wrong: "\"That's price fixing under the Sherman Antitrust Act. Federal crime.\""
    }
  },
],

// ===== CHAPTER 3: ESTATES & INTERESTS (3 scenes) =====
3: [
  { day: 7, title: "Nailed Down or Carried Out?", location: "Hunts Point Market District",
    narrative: [
      { speaker: "narrator", text: "Marcus takes Denise to a warehouse conversion near Hunts Point." },
      { speaker: "marcus", text: "Real property is land and everything permanently attached. Personal property \u2014 chattel \u2014 is movable." },
      { speaker: "marcus", text: "A fixture used to be chattel but is now permanently attached. Trade fixtures are business equipment a tenant can remove. Emblements are crops." },
      { speaker: "marcus", text: "When there's a dispute, we use the MARIA test: Method, Adaptability, Relationship, Intent, Agreement." }
    ],
    learn: { title: "Real vs. Personal Property", emoji: "\ud83d\udd29",
      cards: [
        { title: "Property Types", text: "<b>Real Property</b> \u2014 land + permanent attachments<br><b>Personal Property (Chattel)</b> \u2014 movable<br><b>Fixture</b> \u2014 chattel <b>permanently attached</b> to real property" },
        { title: "Trade Fixtures & Emblements", text: "<b>Trade Fixtures</b> \u2014 business equipment, tenant can remove<br><b>Emblements</b> \u2014 crops, personal property of grower" },
        { title: "MARIA Test", text: "<b>M</b>ethod of attachment<br><b>A</b>daptability<br><b>R</b>elationship of parties<br><b>I</b>ntent<br><b>A</b>greement" }
      ]
    },
    challenge: { setup: "A seller installed a built-in bookcase bolted into the wall studs and wants to take it.",
      q: "Under MARIA, this is most likely:",
      a: ["Personal property", "A trade fixture", "A fixture that conveys with the property", "An emblement"],
      correct: 2, why: "Bolted in, custom-fitted, meant to be permanent = fixture under MARIA.",
      right: "\"Bolted in, custom-built, meant to stay. It's a fixture.\"",
      wrong: "\"Think MARIA \u2014 it's bolted in and meant to be permanent. That's a fixture.\""
    }
  },
  { day: 7, title: "Owning It", location: "Bronx Hall of Justice",
    narrative: [
      { speaker: "narrator", text: "At the County Clerk's office, Marcus explains ownership types." },
      { speaker: "marcus", text: "Fee Simple Absolute is the highest form of ownership \u2014 inheritable, can be sold or mortgaged." },
      { speaker: "marcus", text: "Life Estate gives ownership for one person's lifetime. Then it passes to the Remainderman." },
      { speaker: "marcus", text: "For co-ownership: Tenancy in Common has separate inheritable shares. Joint Tenancy has equal shares with right of survivorship. Tenancy by the Entirety is for married couples." }
    ],
    learn: { title: "Estates & Ownership", emoji: "\ud83d\udcdc",
      cards: [
        { title: "Freehold Estates", text: "<b>Fee Simple</b> \u2014 highest ownership, inheritable<br><b>Life Estate</b> \u2014 limited to person's life, passes to <b>Remainderman</b>" },
        { title: "Co-Ownership", text: "<b>Tenancy in Common</b> \u2014 separate shares, inheritable<br><b>Joint Tenancy</b> \u2014 equal shares, <b>right of survivorship</b><br><b>Tenancy by Entirety</b> \u2014 married couples, survivorship" },
        { title: "Deed Types", text: "<b>Full Covenant & Warranty</b> \u2014 best<br><b>Bargain & Sale w/ Covenant</b> \u2014 typical NY<br><b>Quitclaim</b> \u2014 worst, no guarantees" },
        { title: "Recording", text: "<b>Recording</b> a deed = <b>constructive notice</b> to the world of ownership." }
      ]
    },
    challenge: { setup: "An elderly homeowner wants to live in her brownstone for life, then her daughter gets it.",
      q: "What estate should the mother retain?",
      a: ["Fee Simple Absolute", "Joint Tenancy", "Life Estate with daughter as Remainderman", "Tenancy by the Entirety"],
      correct: 2, why: "A Life Estate lets her live there for life. Daughter as Remainderman gets it upon her death.",
      right: "\"Life Estate. Mom stays, daughter inherits. Perfect.\"",
      wrong: "\"That's a Life Estate with the daughter as Remainderman.\""
    }
  },
  { day: 7, title: "Surveys & Boundaries", location: "Van Cortlandt Park",
    narrative: [
      { speaker: "narrator", text: "Walking the edge of Van Cortlandt Park, Marcus uses the landscape to teach surveying." },
      { speaker: "marcus", text: "Metes and Bounds is the oldest survey method. Metes are direction and distance. Bounds are landmarks." },
      { speaker: "marcus", text: "A Benchmark or Datum is a reference point for elevation from the U.S. Geological Survey." }
    ],
    learn: { title: "Land Descriptions", emoji: "\ud83d\uddfa\ufe0f",
      cards: [
        { title: "Metes & Bounds", text: "The <b>oldest survey method</b>. Uses <b>metes</b> (direction/distance) and <b>bounds</b> (landmarks). Starts/ends at <b>Point of Beginning</b>." },
        { title: "Benchmark / Datum", text: "A fixed reference point for measuring <b>elevation</b>. Set by U.S. Geological Survey." }
      ]
    },
    challenge: { setup: "A survey reads: 'Beginning at the iron pin, thence South 45\u00b0 West 200 feet...'",
      q: "Which survey method is this?",
      a: ["Rectangular Survey", "Lot and Block", "Metes and Bounds", "GPS Coordinates"],
      correct: 2, why: "Compass bearings, distances, monuments, Point of Beginning = Metes and Bounds.",
      right: "\"Compass directions, distances, monuments \u2014 classic Metes and Bounds.\"",
      wrong: "\"That's Metes and Bounds \u2014 the oldest survey method.\""
    }
  },
],

// ===== CHAPTER 4: LEASES & CONTRACTS (2 scenes) =====
4: [
  { day: 8, title: "Leasing the Bronx", location: "Hub Third Avenue, Melrose",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise tour The Hub's commercial strip with 'For Lease' signs everywhere." },
      { speaker: "marcus", text: "Estate for Years has a fixed term. Estate at Will has no set end. Estate at Sufferance is a holdover tenant." },
      { speaker: "marcus", text: "Gross Lease means flat rent. Net Lease means tenant pays expenses too. Percentage Lease is base rent plus a percentage of sales." },
      { speaker: "marcus", text: "In a sublease, the original tenant stays liable. In an assignment, all rights transfer." }
    ],
    learn: { title: "Lease Types", emoji: "\ud83c\udfea",
      cards: [
        { title: "Leasehold Estates", text: "<b>Estate for Years</b> \u2014 fixed term<br><b>Estate at Will</b> \u2014 no set end<br><b>Estate at Sufferance</b> \u2014 holdover tenant" },
        { title: "Rent Structures", text: "<b>Gross Lease</b> \u2014 flat rent, landlord pays expenses<br><b>Net Lease</b> \u2014 tenant pays expenses too<br><b>Percentage Lease</b> \u2014 base + % of sales" },
        { title: "Sublease vs. Assignment", text: "<b>Sublease</b> \u2014 tenant <b>stays liable</b><br><b>Assignment</b> \u2014 tenant <b>transfers all rights</b>" }
      ]
    },
    challenge: { setup: "A sneaker store pays $4,000/mo base plus 5% of sales over $50,000. Last month they did $80,000.",
      q: "What type of lease and what's the total rent?",
      a: ["Gross Lease \u2014 $4,000", "Net Lease \u2014 $5,500", "Percentage Lease \u2014 $5,500", "Percentage Lease \u2014 $8,000"],
      correct: 2, why: "$4,000 base + 5% of ($80K - $50K) = $4,000 + $1,500 = $5,500.",
      right: "\"Percentage Lease. $4K base plus 5% of the $30K over threshold.\"",
      wrong: "\"It's a Percentage Lease: $4K + 5% of $30K = $5,500.\""
    }
  },
  { day: 8, title: "Seal the Deal", location: "Bronx Borough Hall",
    narrative: [
      { speaker: "narrator", text: "Marcus prepares Denise for contract law." },
      { speaker: "marcus", text: "Every valid contract needs five elements: Competent Parties, Mutual Consent, Lawful Object, Consideration, and Writing \u2014 that's the Statute of Frauds." },
      { speaker: "marcus", text: "Void means it never existed. Voidable means one party can cancel. Executed means done. Executory means pending." },
      { speaker: "marcus", text: "Time is of the Essence means strict deadlines. Specific Performance is when the court forces completion." }
    ],
    learn: { title: "Contract Law", emoji: "\u270d\ufe0f",
      cards: [
        { title: "Five Elements", text: "<b>1.</b> Competent Parties<br><b>2.</b> Mutual Consent<br><b>3.</b> Lawful Object<br><b>4.</b> Consideration<br><b>5.</b> Writing (Statute of Frauds)" },
        { title: "Contract Status", text: "<b>Void</b> \u2014 never existed<br><b>Voidable</b> \u2014 one party can cancel<br><b>Executed</b> \u2014 complete<br><b>Executory</b> \u2014 pending" },
        { title: "Key Clauses", text: "<b>Time is of the Essence</b> \u2014 strict deadlines, missing = breach<br><b>Specific Performance</b> \u2014 court forces completion (property is unique)" }
      ]
    },
    challenge: { setup: "A contract has a 'Time is of the Essence' clause. The buyer wants a two-week extension.",
      q: "What does this clause mean?",
      a: ["Extension is automatic", "Deadlines are strict \u2014 missing them is a breach", "Seller must wait 30 days", "Only applies to seller"],
      correct: 1, why: "Time is of the Essence makes all deadlines strictly binding.",
      right: "\"The deadline is the deadline. Miss it, lose the deal.\"",
      wrong: "\"Every deadline is carved in stone. Missing it is a breach.\""
    }
  },
],

// ===== CHAPTER 5: MORTGAGES (2 scenes) =====
5: [
  { day: 8, title: "Understanding Mortgages", location: "Marcus's Office \u2014 The Bronx",
    narrative: [
      { speaker: "narrator", text: "Marcus pulls out a thick loan document as Denise settles in." },
      { speaker: "marcus", text: "A mortgage is a document that creates a lien on property as security for a debt. The mortgagee is the lender, the mortgagor is the borrower." },
      { speaker: "marcus", text: "If a borrower misses 3 payments, the acceleration clause kicks in \u2014 entire balance due immediately." },
      { speaker: "marcus", text: "FHA loans are government-insured for low-income borrowers. VA loans are for veterans with 0% down. Conventional loans are non-government and riskier." }
    ],
    learn: { title: "Mortgage Fundamentals", emoji: "\ud83c\udfe6",
      cards: [
        { title: "What is a Mortgage?", text: "A <b>mortgage</b> creates a <b>lien</b> on property. <b>Mortgagee</b> = <b>Lender</b>. <b>Mortgagor</b> = <b>Borrower</b>." },
        { title: "Acceleration Clause", text: "If borrower misses <b>3 payments</b>, the <b>entire balance becomes due immediately</b>." },
        { title: "FHA Loans", text: "<b>Government-insured</b> mortgages for <b>low-income borrowers</b>." },
        { title: "VA Loans", text: "For <b>veterans</b>. <b>0% down payment</b>. <b>Guaranteed by government</b>." },
        { title: "Conventional Loans", text: "<b>Non-government</b> mortgages. Higher credit requirements. Considered <b>riskier</b> for lenders." }
      ]
    },
    challenge: { setup: "A veteran with good credit but limited savings asks about financing.",
      q: "Which loan is MOST beneficial for this veteran?",
      a: ["FHA loan", "VA loan with 0% down", "Conventional loan", "Any loan with acceleration clause"],
      correct: 1, why: "VA loans offer 0% down payment with government guarantee \u2014 ideal for veterans with limited savings.",
      right: "\"VA loan, zero down. That's going to save tens of thousands upfront.\"",
      wrong: "\"As a veteran, the VA loan with 0% down is the best option here.\""
    }
  },
  { day: 9, title: "The Secondary Market", location: "Coffee Shop \u2014 Grand Concourse",
    narrative: [
      { speaker: "narrator", text: "Over coffee, Marcus sketches how mortgages flow through the financial system." },
      { speaker: "marcus", text: "The primary market is where lenders interact with borrowers. The secondary market is where loans get bought and sold." },
      { speaker: "marcus", text: "Fannie Mae buys all types. Ginnie Mae buys only FHA and VA. Freddie Mac buys from member banks." },
      { speaker: "marcus", text: "Pre-qualification is just a conversation. Pre-approval requires actual documents \u2014 much stronger. And borrowers have 3 business days to cancel on a primary residence \u2014 Right of Rescission." }
    ],
    learn: { title: "Secondary Market & Loan Types", emoji: "\ud83d\udcb0",
      cards: [
        { title: "Primary vs Secondary", text: "<b>Primary</b> = lenders deal with borrowers. <b>Secondary</b> = loans bought/sold among institutions." },
        { title: "Fannie Mae (FNMA)", text: "Buys <b>all types</b> of mortgages." },
        { title: "Ginnie Mae (GNMA)", text: "Buys <b>only FHA and VA</b> loans." },
        { title: "Freddie Mac (FHLMC)", text: "Buys from <b>member banks</b>." },
        { title: "Pre-Qual vs Pre-Approval", text: "<b>Pre-qualification</b> = conversation. <b>Pre-approval</b> = verified documents. Much stronger." },
        { title: "Right of Rescission", text: "<b>3 business days</b> to cancel a loan on <b>primary residence</b>." }
      ]
    },
    challenge: { setup: "A buyer got pre-qualified but the seller's agent says they need something stronger.",
      q: "What should you advise?",
      a: ["Letter from Ginnie Mae", "Pre-approval with verified documents", "Fixed-rate commitment letter", "Proof of rescission rights"],
      correct: 1, why: "Pre-approval with actual documentation is much stronger than pre-qualification.",
      right: "\"Pre-approval shows sellers you're serious. Let's get you fully approved.\"",
      wrong: "\"Pre-qualification isn't enough. You need pre-approval with verified documents.\""
    }
  },
],

// ===== CHAPTER 6: LAND USE (2 scenes) =====
6: [
  { day: 10, title: "Land Use Controls", location: "City Planning Office \u2014 The Bronx",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise meet with a city planner about property regulations." },
      { speaker: "marcus", text: "Private controls come from deed restrictions. Public controls come from police power \u2014 the government's right to regulate." },
      { speaker: "marcus", text: "Eminent domain lets government force a sale at fair market value. That process is called condemnation." },
      { speaker: "marcus", text: "If someone dies with no will and no heirs, the property escheats to the state. And buildings must be 30 years old for landmark designation." }
    ],
    learn: { title: "Government Powers & Land Use", emoji: "\ud83c\udfdb\ufe0f",
      cards: [
        { title: "Private Controls", text: "<b>Deed restrictions</b> limit how property can be used. They run with the land." },
        { title: "Public Controls", text: "<b>Police power</b> = government authority for <b>public health, safety, and welfare</b>." },
        { title: "Eminent Domain", text: "Government can <b>force sale</b> for public use. Called <b>condemnation</b>. Must pay <b>fair market value</b>." },
        { title: "Escheat", text: "No will + no heirs = property goes to the <b>state</b>." },
        { title: "Landmarks", text: "Buildings must be <b>30 years old</b> for landmark designation." }
      ]
    },
    challenge: { setup: "A property owner died with no will and no living relatives.",
      q: "What happens to the property?",
      a: ["Sold through eminent domain", "Escheats to the state", "Protected as landmark", "Deed restrictions prevent transfer"],
      correct: 1, why: "No will + no heirs = escheat. Property reverts to the state.",
      right: "\"Without a will or heirs, the property escheats to the state.\"",
      wrong: "\"That's escheat \u2014 no will, no heirs, state takes it.\""
    }
  },
  { day: 11, title: "Zoning Regulations", location: "Zoning Board Hearing \u2014 Bronx County",
    narrative: [
      { speaker: "narrator", text: "Denise observes her first zoning board hearing." },
      { speaker: "marcus", text: "Four zoning types: Residential, Commercial, Industrial, Agricultural. Spot zoning \u2014 rezoning one small parcel differently \u2014 is illegal in New York." },
      { speaker: "marcus", text: "Variances are permanent exceptions. Use variance changes what you can do. Area variance changes size requirements." },
      { speaker: "marcus", text: "The Certificate of Occupancy is the 'birth certificate' of a property. And nonconforming use means existing uses continue after rezoning." }
    ],
    learn: { title: "Zoning & Variances", emoji: "\ud83d\udccb",
      cards: [
        { title: "Zoning Categories", text: "<b>Residential, Commercial, Industrial, Agricultural</b>." },
        { title: "Spot Zoning", text: "Rezoning one small parcel inconsistently = <b>illegal in NY</b>." },
        { title: "Variances", text: "<b>Permanent</b> exceptions. <b>Use Variance</b> = change usage. <b>Area Variance</b> = change size." },
        { title: "C of O", text: "<b>Certificate of Occupancy</b> = the <b>'birth certificate'</b> of a property." },
        { title: "Nonconforming Use", text: "Existing use <b>continues after rezoning</b> (grandfathered in)." },
        { title: "Article 78", text: "Lawsuit to <b>challenge government agency decisions</b>." }
      ]
    },
    challenge: { setup: "A grocery store owner's area just got rezoned from commercial to residential.",
      q: "What happens to the store?",
      a: ["Must close immediately", "Can continue as nonconforming use", "Needs spot zoning approval", "Must get area variance in 30 days"],
      correct: 1, why: "Nonconforming use (grandfathering) allows existing uses to continue after rezoning.",
      right: "\"Your store is grandfathered in. You can keep operating.\"",
      wrong: "\"The rezoning doesn't force existing businesses to close. That's nonconforming use.\""
    }
  },
],

// ===== CHAPTER 7: CONSTRUCTION & ENVIRONMENT (2 scenes) =====
7: [
  { day: 11, title: "Construction Basics", location: "New Construction Site \u2014 Parkchester",
    narrative: [
      { speaker: "narrator", text: "Marcus takes Denise to a construction site." },
      { speaker: "marcus", text: "Blueprints are the architect's drawing. Building specifications are the written details." },
      { speaker: "marcus", text: "Platform framing is the best \u2014 each floor is a separate platform. Post and beam is good. Balloon framing is not good." },
      { speaker: "marcus", text: "Studs are in walls, joists hold up floors, rafters hold up the roof. R-Factor measures insulation \u2014 higher is better." }
    ],
    learn: { title: "Construction Components", emoji: "\ud83c\udfd7\ufe0f",
      cards: [
        { title: "Blueprint vs Specs", text: "<b>Blueprint</b> = architect's <b>drawing</b>. <b>Specifications</b> = <b>written details</b>." },
        { title: "Water & Sewer", text: "Water: <b>Municipal</b> or <b>Private Well</b>. Sewer: <b>Municipal</b> or <b>Septic</b>." },
        { title: "Framing Methods", text: "<b>Platform</b> (best) \u2014 <b>Post & Beam</b> (good) \u2014 <b>Balloon</b> (worst)" },
        { title: "Wood Components", text: "<b>Studs</b> = walls. <b>Joists</b> = floors. <b>Rafters</b> = roof." },
        { title: "R-Factor", text: "Measures insulation. <b>Higher = better</b> insulation." }
      ]
    },
    challenge: { setup: "A buyer compares houses: one has R-30 insulation, the other R-15.",
      q: "Which has better insulation?",
      a: ["R-15, lower is tighter", "R-30, higher R-Factor is better", "They're equivalent", "Depends on framing type"],
      correct: 1, why: "Higher R-Factor = better insulation. R-30 is significantly better than R-15.",
      right: "\"R-30 has much better insulation and lower energy costs.\"",
      wrong: "\"Higher R-Factor is better. R-30 is twice the insulation value.\""
    }
  },
  { day: 12, title: "Environmental Hazards", location: "Pre-1978 Home \u2014 Fordham",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise walk through an older home requiring environmental disclosures." },
      { speaker: "marcus", text: "Lead paint is your biggest concern in pre-1978 homes. You must disclose." },
      { speaker: "marcus", text: "Asbestos was used for fireproofing. If it's friable \u2014 crumbling and airborne \u2014 that's dangerous." },
      { speaker: "marcus", text: "Radon is a natural radioactive gas. Ventilate the basement. NYSDOH is the lead agency for water quality." }
    ],
    learn: { title: "Environmental Concerns", emoji: "\u26a0\ufe0f",
      cards: [
        { title: "Lead Paint", text: "Homes <b>before 1978</b> may have lead paint. Sellers <b>must disclose</b>." },
        { title: "Asbestos", text: "Used for <b>fireproofing</b>. <b>Friable</b> = crumbling and <b>airborne</b> = dangerous." },
        { title: "Radon", text: "<b>Natural radioactive gas</b>. Mitigation = <b>ventilating the basement</b>." },
        { title: "NYSDOH", text: "<b>NY State Dept of Health</b> = lead agency for <b>water quality</b>." },
        { title: "Other Terms", text: "<b>Sill Plate</b> = first wood on foundation. <b>BTU</b> = energy measurement. <b>Voltage</b>: 110v (outlets) / 220v (appliances)." }
      ]
    },
    challenge: { setup: "In a 1972 home, the inspector finds crumbling insulation creating dust in the attic.",
      q: "What's the primary concern?",
      a: ["Low R-Factor", "Building code violation", "Friable asbestos", "Lead paint from 1970s"],
      correct: 2, why: "Crumbling insulation in a 1970s home could be friable asbestos \u2014 airborne and dangerous.",
      right: "\"That could be friable asbestos. We need professional testing immediately.\"",
      wrong: "\"Crumbling insulation in that era could be friable asbestos. Get it tested.\""
    }
  },
],

// ===== CHAPTER 8: VALUATION (2 scenes) =====
8: [
  { day: 13, title: "The Art of Appraisal", location: "Fordham Road Office \u2014 The Bronx",
    narrative: [
      { speaker: "narrator", text: "Marcus spreads out three property reports, each using different valuation methods." },
      { speaker: "marcus", text: "The four elements of value: demand, utility, scarcity, and transferability. An appraisal is an unbiased estimate." },
      { speaker: "marcus", text: "For residential: Sales Comparison \u2014 3 comparable sold properties from last 6-12 months. For special purpose: Cost Approach. For rentals: Income Approach using cap rate." },
      { speaker: "denise", text: "A cap rate of 5% or higher generally indicates a solid investment." }
    ],
    learn: { title: "Property Valuation Methods", emoji: "\ud83d\udcca",
      cards: [
        { title: "Four Elements of Value", text: "<b>Demand</b>, <b>Utility</b>, <b>Scarcity</b>, <b>Transferability</b>. All four must exist." },
        { title: "Sales Comparison", text: "For <b>residential</b>. Compare to <b>3 sold comps</b> from past <b>6-12 months</b>." },
        { title: "Cost Approach", text: "For <b>special purpose</b> buildings. <b>Cost to build + land value</b>." },
        { title: "Income Approach", text: "For <b>rental properties</b>. Uses <b>cap rate</b>. <b>5%+ = good investment</b>." }
      ]
    },
    challenge: { setup: "A 6-unit apartment building generates $72,000 NOI. Asking $1,200,000.",
      q: "Which appraisal approach is most appropriate?",
      a: ["Sales Comparison", "Cost Approach", "Income Approach", "All three equally"],
      correct: 2, why: "Income Approach for rental properties. Cap rate = $72K / $1.2M = 6%, which is solid.",
      right: "\"Income Approach. The cap rate is 6% \u2014 solid return.\"",
      wrong: "\"Investment properties are valued on income potential. Use the Income Approach.\""
    }
  },
  { day: 14, title: "Understanding Value Types", location: "Pelham Parkway Property Tour",
    narrative: [
      { speaker: "narrator", text: "Standing outside a Tudor home, Marcus pulls up multiple value estimates." },
      { speaker: "denise", text: "I'm seeing four different values for the same property. Which is correct?" },
      { speaker: "marcus", text: "They're all correct for different purposes. Market value is what it sells for. Assessed value is for taxes. Insured value is replacement cost. Mortgage value is the loan balance." },
      { speaker: "marcus", text: "For listing, we prepare a CMA \u2014 Comparative Market Analysis using sold, active, and expired listings." }
    ],
    learn: { title: "Types of Property Value", emoji: "\ud83d\udcb0",
      cards: [
        { title: "Market Value", text: "What a <b>willing seller</b> accepts and <b>willing buyer</b> pays." },
        { title: "Assessed Value", text: "<b>Government value</b> used to calculate <b>property taxes</b>." },
        { title: "Insured Value", text: "<b>Replacement cost</b> (modern materials) vs <b>reproduction cost</b> (exact match, more expensive)." },
        { title: "CMA", text: "<b>Comparative Market Analysis</b>: <b>sold</b>, <b>active</b>, and <b>expired</b> listings." },
        { title: "Highest & Best Use", text: "The use that generates <b>maximum rental income</b> for investment property." }
      ]
    },
    challenge: { setup: "A seller asks which value determines their property taxes.",
      q: "Which value is used by government for taxes?",
      a: ["Market Value", "Assessed Value", "Insured Value", "Mortgage Value"],
      correct: 1, why: "Assessed value is the government's valuation specifically for tax purposes.",
      right: "\"Assessed value \u2014 that's what the city uses for tax calculations.\"",
      wrong: "\"Property taxes use assessed value, not market value.\""
    }
  },
],

// ===== CHAPTER 9: HUMAN RIGHTS (2 scenes) =====
9: [
  { day: 14, title: "Fair Housing Foundations", location: "Concourse Village Office",
    narrative: [
      { speaker: "narrator", text: "Marcus hangs the required Fair Housing poster on the office wall." },
      { speaker: "marcus", text: "The Civil Rights Act of 1866 prohibits discrimination based on race and color with absolutely NO exceptions." },
      { speaker: "marcus", text: "Fair Housing Act of 1968 added religion and national origin. Sex was added in 1974. Disabilities and familial status in 1988 \u2014 fines up to $55,000." },
      { speaker: "denise", text: "The Fair Housing poster must be displayed in every real estate office." }
    ],
    learn: { title: "Federal Fair Housing Laws", emoji: "\u2696\ufe0f",
      cards: [
        { title: "Civil Rights Act 1866", text: "<b>Race and color</b> only. <b>NO exceptions</b> whatsoever." },
        { title: "Fair Housing Act 1968", text: "<b>Race, Color, Religion, National Origin</b>." },
        { title: "1974 Amendment", text: "<b>Sex/Gender</b> added as protected class." },
        { title: "1988 Amendments", text: "<b>Disabilities</b> and <b>Familial Status</b> (children under 18). Fines up to <b>$55,000</b>." },
        { title: "Fair Housing Poster", text: "<b>Must be displayed</b> in every real estate office." }
      ]
    },
    challenge: { setup: "A landlord says he won't rent to families with kids because they're 'too noisy.'",
      q: "What is the correct response?",
      a: ["Agree \u2014 it's his property", "Refuse \u2014 violates familial status protections", "Comply if he lives in the building", "Suggest raising rent instead"],
      correct: 1, why: "Familial status protections (1988) prohibit discrimination against families with children.",
      right: "\"I cannot discriminate based on familial status. That's the law.\"",
      wrong: "\"Familial status is protected. You cannot refuse families with children.\""
    }
  },
  { day: 15, title: "Illegal Housing Practices", location: "Kingsbridge Road Community Meeting",
    narrative: [
      { speaker: "narrator", text: "At a community forum, Marcus explains discriminatory practices." },
      { speaker: "marcus", text: "Steering is directing people to neighborhoods based on race. Blockbusting is scaring owners into selling. Redlining is banks refusing loans by area." },
      { speaker: "marcus", text: "New York State adds age, marital status, sexual orientation, and military status. NYC adds alienage, lawful occupation, and source of income." },
      { speaker: "denise", text: "Complaints must be filed within 1 year." }
    ],
    learn: { title: "Discriminatory Practices", emoji: "\ud83d\udeab",
      cards: [
        { title: "Steering", text: "<b>Directing people</b> to/from neighborhoods based on <b>protected classes</b>." },
        { title: "Blockbusting", text: "<b>Scaring owners into selling</b> by claiming neighborhood is 'changing.'" },
        { title: "Redlining", text: "<b>Banks refusing loans</b> based on neighborhood demographics." },
        { title: "NYS Additions", text: "<b>Age, Marital Status, Sexual Orientation, Military Status</b>." },
        { title: "NYC Additions", text: "<b>Alienage/Citizenship, Lawful Occupation, Source of Income</b>. File within <b>1 year</b>." }
      ]
    },
    challenge: { setup: "An agent tells a homeowner 'values are plummeting because the neighborhood demographics are shifting' to get her to sell.",
      q: "What illegal practice is this?",
      a: ["Steering", "Redlining", "Blockbusting", "Nothing illegal"],
      correct: 2, why: "Using fear of demographic changes to pressure selling = blockbusting.",
      right: "\"That's blockbusting. Completely illegal. Don't fall for it.\"",
      wrong: "\"Scaring owners into selling with demographic fears is blockbusting.\""
    }
  },
],

// ===== CHAPTER 10: REAL ESTATE MATH (2 scenes) =====
10: [
  { day: 15, title: "Commission Calculations", location: "Tremont Office \u2014 The Bronx",
    narrative: [
      { speaker: "narrator", text: "Denise reviews her first commission check breakdown." },
      { speaker: "marcus", text: "Sale price times commission rate equals total commission. Then it splits between listing and selling sides, then again with your broker." },
      { speaker: "marcus", text: "Prorations divide expenses by time. Use yearly divided by 365 for daily rate, or divided by 12 for monthly." }
    ],
    learn: { title: "Commissions & Prorations", emoji: "\ud83e\uddee",
      cards: [
        { title: "Commission Formula", text: "<b>Sale Price \u00d7 Rate = Total Commission</b>. Then split listing/selling, then split with broker." },
        { title: "Commission Splits", text: "Total splits <b>between listing and selling sides</b>. Then each agent splits with their <b>broker</b>." },
        { title: "Proration", text: "Divide expenses proportionally. <b>Yearly \u00f7 365</b> = daily rate. <b>Yearly \u00f7 12</b> = monthly rate." }
      ]
    },
    challenge: { setup: "$500,000 sale, 6% commission, 50/50 split, your broker split is 65/35 (you get 65%). You're the selling agent.",
      q: "How much do you receive?",
      a: ["$30,000", "$19,500", "$15,000", "$9,750"],
      correct: 3, why: "$500K \u00d7 6% = $30K. \u00f7 2 = $15K your side. \u00d7 65% = $9,750.",
      right: "\"$30K total, $15K your side, 65% split = $9,750. Solid check!\"",
      wrong: "\"Split twice: $30K total \u00f7 2 = $15K, then \u00d7 65% = $9,750.\""
    }
  },
  { day: 15, title: "Investment Property Math", location: "Grand Concourse Investment Property",
    narrative: [
      { speaker: "narrator", text: "Marcus walks Denise through investment calculations at an apartment building." },
      { speaker: "marcus", text: "Square feet to square yards: divide by 9. Points are percentages of the loan amount." },
      { speaker: "marcus", text: "Cap Rate equals NOI divided by purchase price. For depreciation: residential is 27.5 years, commercial is 39 years. Land NEVER depreciates." }
    ],
    learn: { title: "Investment Math", emoji: "\ud83d\udcd0",
      cards: [
        { title: "Conversions", text: "<b>Square feet to square yards: \u00f7 9</b>." },
        { title: "Points", text: "<b>1 point = 1%</b> of the loan amount. Paid at closing." },
        { title: "Cap Rate", text: "<b>NOI \u00f7 Purchase Price</b>. Higher = better return." },
        { title: "Depreciation", text: "<b>Residential: 27.5 years</b>. <b>Commercial: 39 years</b>. <b>Land does NOT depreciate</b>." },
        { title: "Formula", text: "<b>(Purchase Price - Land Value) \u00f7 27.5</b> = annual residential depreciation." }
      ]
    },
    challenge: { setup: "Residential property: $825,000 purchase, $165,000 land value.",
      q: "What is the annual depreciation?",
      a: ["$30,000", "$24,000", "$6,000", "$21,164"],
      correct: 1, why: "Building = $825K - $165K = $660K. \u00f7 27.5 = $24,000 annual depreciation.",
      right: "\"$660K in improvements \u00f7 27.5 = $24,000. Land never depreciates.\"",
      wrong: "\"Subtract land first: ($825K - $165K) \u00f7 27.5 = $24,000.\""
    }
  },
],

// ===== CHAPTER 11: MUNICIPAL AGENCIES (2 scenes) =====
11: [
  { day: 16, title: "Municipal Structures", location: "Bronx County Courthouse",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise meet at the courthouse to discuss municipal governance." },
      { speaker: "marcus", text: "New York has 62 counties. NYC's 5 boroughs are also counties: Manhattan is New York County, Brooklyn is Kings, Queens is Queens, Bronx is Bronx, Staten Island is Richmond." },
      { speaker: "denise", text: "And municipalities include cities, towns, and villages \u2014 a village needs at least 500 residents to incorporate." }
    ],
    learn: { title: "Municipal Organization", emoji: "\ud83c\udfdb\ufe0f",
      cards: [
        { title: "62 Counties", text: "New York State has <b>62 counties</b>." },
        { title: "NYC Boroughs = Counties", text: "<b>Manhattan</b> = New York County<br><b>Brooklyn</b> = Kings<br><b>Queens</b> = Queens<br><b>Bronx</b> = Bronx<br><b>Staten Island</b> = Richmond" },
        { title: "Municipality Types", text: "<b>City, County/Borough, Town, Village</b>. Village requires <b>500+ residents</b>." }
      ]
    },
    challenge: { setup: "A community with 450 residents calls itself a village.",
      q: "Is this correct?",
      a: ["Yes, over 400 is enough", "No \u2014 villages require at least 500 residents", "Village status is only for NYC", "Population doesn't matter"],
      correct: 1, why: "Villages need a minimum of 500 residents to incorporate.",
      right: "\"Good catch! 450 isn't enough \u2014 need 500 for a village.\"",
      wrong: "\"Villages need 500 residents minimum to incorporate.\""
    }
  },
  { day: 17, title: "Government Valuations", location: "Bronx Building Department",
    narrative: [
      { speaker: "narrator", text: "Marcus takes Denise to the Building Department." },
      { speaker: "marcus", text: "The Tax Assessor estimates property value for taxes. Three values: Market for resale, Appraisal from lenders, Assessed for taxes." },
      { speaker: "marcus", text: "Zoning Board of Appeals grants variances. Article 78 challenges government decisions. The Building Department issues Certificates of Occupancy." }
    ],
    learn: { title: "Government Property Oversight", emoji: "\ud83d\udccb",
      cards: [
        { title: "Tax Assessor", text: "Estimates <b>assessed value</b> for calculating property taxes." },
        { title: "Three Values", text: "<b>Market</b> (resale), <b>Appraisal</b> (lender), <b>Assessed</b> (government/taxes)." },
        { title: "Zoning Board", text: "Grants <b>variances</b> (exceptions to zoning)." },
        { title: "Other Agencies", text: "<b>Building Dept</b> = C of O. <b>NYSDOH</b> = water issues. <b>Landmark</b> = 30+ years." }
      ]
    },
    challenge: { setup: "Your client wants to add a third story but zoning limits buildings to two.",
      q: "Where should they seek an exception?",
      a: ["Building Department for C of O", "Zoning Board of Appeals for a variance", "NYSDOH for approval", "File Article 78 immediately"],
      correct: 1, why: "The Zoning Board of Appeals grants variances \u2014 exceptions to zoning rules.",
      right: "\"Zoning Board of Appeals for a variance. That's the proper channel.\"",
      wrong: "\"For zoning exceptions, apply to the Zoning Board of Appeals.\""
    }
  },
],

// ===== CHAPTER 12: PROPERTY INSURANCE (1 scene) =====
12: [
  { day: 17, title: "Homeowner's Insurance", location: "Insurance Office \u2014 Fordham Road",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise visit an insurance office to review policy types." },
      { speaker: "marcus", text: "HO-1 is basic, HO-2 is broad, HO-3 is what lenders prefer \u2014 covers all risks except flood, earthquake, war, and nuclear." },
      { speaker: "marcus", text: "HO-5 is comprehensive. HO-4 is for co-ops and rentals. HO-6 is for condos. HO-8 is cash value for older homes." },
      { speaker: "marcus", text: "Flood insurance comes only from FEMA/NFIP. Replacement cost uses modern materials. Reproduction cost is exact replication \u2014 more expensive." }
    ],
    learn: { title: "Insurance Types", emoji: "\ud83c\udfe0",
      cards: [
        { title: "Policy Levels", text: "<b>HO-1</b> Basic. <b>HO-2</b> Broad. <b>HO-3</b> Most favored (all risks except flood/earthquake/war/nuclear). <b>HO-5</b> Comprehensive." },
        { title: "Specialized", text: "<b>HO-4</b> = Co-op/Rental. <b>HO-6</b> = Condo. <b>HO-8</b> = Cash value (older homes)." },
        { title: "Costs", text: "<b>Replacement</b> = modern equivalent. <b>Reproduction</b> = exact match (more expensive)." },
        { title: "Flood & Umbrella", text: "<b>FEMA/NFIP</b> = only gov flood insurance. <b>Umbrella</b> = secondary liability policy." }
      ]
    },
    challenge: { setup: "Your client has an HO-3 policy on a waterfront condo and asks about flood coverage.",
      q: "Are they covered for flooding?",
      a: ["Yes, HO-3 covers all risks", "Need HO-6 which includes flood", "No \u2014 need separate FEMA/NFIP flood insurance", "Upgrade to HO-5"],
      correct: 2, why: "HO-3 excludes flood. Condo owners need HO-6 plus separate FEMA/NFIP flood insurance.",
      right: "\"Flood is excluded from standard policies. Need separate FEMA/NFIP coverage.\"",
      wrong: "\"Standard policies exclude floods. Get separate FEMA/NFIP insurance.\""
    }
  },
],

// ===== CHAPTER 13: LICENSEE SAFETY (1 scene) =====
13: [
  { day: 18, title: "Agent Safety Protocols", location: "Empire State Realty Office",
    narrative: [
      { speaker: "narrator", text: "Marcus holds a safety training session." },
      { speaker: "marcus", text: "Real estate agents are vulnerable showing properties. Always meet new customers at the office first. Have them fill out contact forms." },
      { speaker: "marcus", text: "Never show vacant properties after dark. Establish distress codes. Bring associates to open houses. Always take separate cars." }
    ],
    learn: { title: "Agent Safety", emoji: "\ud83d\udee1\ufe0f",
      cards: [
        { title: "First Meetings", text: "<b>Meet new customers at the office</b>. Have them fill out <b>contact forms</b>." },
        { title: "Property Showings", text: "<b>Never show vacant properties after dark.</b>" },
        { title: "Communication", text: "Establish <b>distress codes</b> with your office." },
        { title: "Open Houses", text: "<b>Bring associates</b>. Never host alone." },
        { title: "Transportation", text: "<b>Separate cars</b> always. Never depend on clients for rides." }
      ]
    },
    challenge: { setup: "A new client you've never met wants to see a vacant property at 7 PM and offers to pick you up.",
      q: "What's the safest response?",
      a: ["Accept but bring pepper spray", "Meet them there in your own car", "Meet at office first during daytime, show before dark, separate cars", "Show at 7 PM but bring an associate"],
      correct: 2, why: "Combine all safety protocols: meet at office first, daylight showing, separate cars.",
      right: "\"Office meeting, daylight showing, separate cars. All three.\"",
      wrong: "\"Meet at the office first, show before dark, and take separate cars.\""
    }
  },
],

// ===== CHAPTER 14: TAXES & ASSESSMENTS (2 scenes) =====
14: [
  { day: 18, title: "Property Tax Fundamentals", location: "Bronx Tax Office",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise visit the tax office." },
      { speaker: "marcus", text: "Property taxes fund schools, police, fire departments, and roads." },
      { speaker: "marcus", text: "Partial exemptions for veterans, seniors, and disabled individuals. Full exemptions for government buildings and places of worship." },
      { speaker: "marcus", text: "Tax Levy divided by Assessment Roll equals the Tax Rate. Then Assessed Value times Tax Rate equals your taxes." }
    ],
    learn: { title: "Property Taxation", emoji: "\ud83d\udcb0",
      cards: [
        { title: "What Taxes Fund", text: "<b>Schools, Police, Fire, Roads</b>." },
        { title: "Partial Exemptions", text: "<b>Veterans, Seniors, Disabled</b> get partial exemptions." },
        { title: "Full Exemptions", text: "<b>Government buildings</b> and <b>Places of Worship</b> = fully exempt." },
        { title: "Tax Rate Formula", text: "<b>Tax Levy \u00f7 Assessment Roll = Tax Rate</b>." },
        { title: "Tax Calculation", text: "<b>Assessed Value \u00d7 Tax Rate = Real Estate Taxes</b>." }
      ]
    },
    challenge: { setup: "Property assessed at $400,000. Tax levy is $50,000,000. Assessment roll is $2,000,000,000.",
      q: "What are the annual taxes?",
      a: ["$5,000", "$10,000", "$20,000", "$25,000"],
      correct: 1, why: "Tax rate = $50M \u00f7 $2B = 0.025 (2.5%). $400K \u00d7 0.025 = $10,000.",
      right: "\"$50M \u00f7 $2B = 2.5% rate. Times $400K = $10,000.\"",
      wrong: "\"Tax rate = $50M \u00f7 $2B = 0.025. Then $400K \u00d7 0.025 = $10,000.\""
    }
  },
  { day: 19, title: "Tax Challenges & Relief", location: "Empire State Realty Office",
    narrative: [
      { speaker: "narrator", text: "Marcus reviews the tax challenge process." },
      { speaker: "marcus", text: "Three steps to challenge an assessment: First, visit the assessor. Second, Board of Assessment Review. Third, NYS Supreme Court via Tax Certiorari." },
      { speaker: "marcus", text: "STAR provides school tax relief for owner-occupied homes. Seniors 65+ get partial exemptions. Tax liens attach to the address, not the owner \u2014 paid at closing." }
    ],
    learn: { title: "Tax Challenges & Relief", emoji: "\u2696\ufe0f",
      cards: [
        { title: "3-Step Challenge", text: "<b>1.</b> Visit assessor<br><b>2.</b> Board of Assessment Review<br><b>3.</b> NYS Supreme Court (Tax Certiorari)" },
        { title: "STAR Program", text: "<b>School Tax Relief</b> for <b>owner-occupied</b> properties." },
        { title: "Senior Exemption", text: "Homeowners <b>65+</b> qualify for <b>partial exemptions</b>." },
        { title: "Tax Liens", text: "Attach to the <b>address, not the owner</b>. Must be paid at <b>closing</b>." }
      ]
    },
    challenge: { setup: "A buyer discovers the previous owner owed $15,000 in back taxes. They say it's not their problem.",
      q: "Who is responsible?",
      a: ["Previous owner only", "Tax liens attach to the address \u2014 the new owner is responsible", "Tax Certiorari eliminates the debt", "STAR covers back taxes"],
      correct: 1, why: "Tax liens attach to the property address. Should have been caught in title search and paid at closing.",
      right: "\"Tax liens attach to the property. Should have been caught in the title search.\"",
      wrong: "\"Tax liens follow the property, not the person. The new owner is responsible.\""
    }
  },
],

// ===== CHAPTER 15: CONDOS & CO-OPS (2 scenes) =====
15: [
  { day: 20, title: "The Condo Question", location: "New Condo \u2014 Mott Haven Waterfront",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise visit a new condominium development on the waterfront." },
      { speaker: "marcus", text: "Condos are real property. You own your unit plus an undivided interest in common elements like the lobby and roof." },
      { speaker: "marcus", text: "The Declaration creates the condominium. The Sponsor \u2014 the developer \u2014 files an Offering Plan with the Attorney General." },
      { speaker: "marcus", text: "A Board of Managers runs the building. Your share of common expenses is based on your floor area percentage." }
    ],
    learn: { title: "Condominium Ownership", emoji: "\ud83c\udfd9\ufe0f",
      cards: [
        { title: "Real Property", text: "Condos are <b>real property</b>. Buyer gets a <b>deed</b> to unit + share of <b>common elements</b>." },
        { title: "Declaration", text: "The <b>Declaration</b> legally <b>creates the condominium</b>." },
        { title: "Offering Plan", text: "Filed with <b>Attorney General</b> by the <b>Sponsor</b> (developer) before selling." },
        { title: "Board of Managers", text: "Elected by unit owners. Operates under <b>bylaws</b>." },
        { title: "Floor Area Percentage", text: "Determines each unit's share of <b>common expenses</b>." }
      ]
    },
    challenge: { setup: "A buyer asks what document legally creates a condominium.",
      q: "Which document creates a condo?",
      a: ["Offering Plan", "The Declaration", "The Bylaws", "Certificate of Occupancy"],
      correct: 1, why: "The Declaration is the legal document that creates the condominium.",
      right: "\"The Declaration is the birth certificate of the condo.\"",
      wrong: "\"The Declaration creates it. Don't confuse it with the Offering Plan.\""
    }
  },
  { day: 20, title: "The Co-op Code", location: "Pre-war Co-op \u2014 Riverdale",
    narrative: [
      { speaker: "narrator", text: "They visit a stately pre-war co-operative in Riverdale." },
      { speaker: "marcus", text: "A co-op is personal property. You buy shares of stock in the corporation that owns the building." },
      { speaker: "marcus", text: "No deed \u2014 you get a Proprietary Lease. The Board of Directors approves every buyer. They can reject for any reason except protected classes." },
      { speaker: "marcus", text: "A Flip Tax is charged when shares are sold. The Recognition Agreement acknowledges the bank's interest. Monthly maintenance includes the building's underlying mortgage." }
    ],
    learn: { title: "Co-op Ownership", emoji: "\ud83c\udfe2",
      cards: [
        { title: "Personal Property", text: "Co-op = <b>personal property</b>. Buyer gets <b>shares of stock</b>, not a deed." },
        { title: "Proprietary Lease", text: "Grants <b>right to occupy</b> a specific unit. Not a deed." },
        { title: "Board Approval", text: "<b>Board of Directors</b> approves buyers. Can reject for any reason <b>except protected classes</b>." },
        { title: "Flip Tax & Recognition", text: "<b>Flip Tax</b> = fee on sale. <b>Recognition Agreement</b> = bank acknowledgment." },
        { title: "Maintenance", text: "Includes owner's share of <b>underlying mortgage</b>, taxes, insurance, operations." }
      ]
    },
    challenge: { setup: "A client asks what they'll receive at closing when buying a co-op.",
      q: "What does a co-op buyer receive?",
      a: ["Certificate of Title", "Proprietary Lease and shares of stock", "Unit deed and common elements", "Condo declaration"],
      correct: 1, why: "Co-op buyers get shares of stock and a Proprietary Lease \u2014 not a deed.",
      right: "\"Shares and a Proprietary Lease. No deed ever changes hands.\"",
      wrong: "\"Co-ops are personal property. You get shares and a Proprietary Lease.\""
    }
  },
],

// ===== CHAPTER 16: COMMERCIAL INVESTMENT (1 scene) =====
16: [
  { day: 21, title: "Running the Numbers", location: "Mixed-Use Building \u2014 Fordham Road",
    narrative: [
      { speaker: "narrator", text: "Marcus brings Denise to evaluate a commercial property." },
      { speaker: "marcus", text: "NOI equals Gross Income minus Operating Expenses. Cap Rate equals NOI divided by Purchase Price." },
      { speaker: "marcus", text: "GRM is Price divided by Gross Monthly Rent. Cash on Cash Return is Annual Cash Flow divided by Cash Invested." },
      { speaker: "marcus", text: "A 1031 Exchange defers capital gains by swapping like-kind properties. 45 days to identify, 180 days to close. Any cash received is called Boot \u2014 and it's taxable." }
    ],
    learn: { title: "Commercial Investment", emoji: "\ud83d\udcca",
      cards: [
        { title: "NOI", text: "<b>Net Operating Income = Gross Income - Expenses</b>. Before mortgage payments." },
        { title: "Cap Rate", text: "<b>NOI \u00f7 Purchase Price</b>. Higher = higher return (and risk)." },
        { title: "GRM & Cash on Cash", text: "<b>GRM = Price \u00f7 Gross Monthly Rent</b>. <b>Cash on Cash = Cash Flow \u00f7 Cash Invested</b>." },
        { title: "1031 Exchange", text: "<b>Like-kind swap</b> to defer capital gains. <b>45 days</b> to identify, <b>180 days</b> to close." },
        { title: "Boot", text: "Cash received in exchange = <b>Boot</b> = <b>taxable</b>." }
      ]
    },
    challenge: { setup: "Property: $120,000 gross income, $40,000 expenses, asking $1,000,000.",
      q: "What is the Cap Rate?",
      a: ["12%", "8%", "4%", "10%"],
      correct: 1, why: "NOI = $120K - $40K = $80K. Cap Rate = $80K \u00f7 $1M = 8%.",
      right: "\"$80K NOI divided by $1M = 8% cap rate. Solid.\"",
      wrong: "\"NOI is $80K ($120K - $40K). Divide by $1M = 8% cap rate.\""
    }
  },
],

// ===== CHAPTER 17: COMMERCIAL LEASES (1 scene) =====
17: [
  { day: 22, title: "Lease Language", location: "Commercial Office \u2014 Hub Third Avenue",
    narrative: [
      { speaker: "narrator", text: "Marcus walks Denise through commercial lease structures." },
      { speaker: "marcus", text: "Net Lease \u2014 tenant pays some expenses. Double Net adds taxes and insurance. Triple Net \u2014 NNN \u2014 tenant pays taxes, insurance, AND maintenance." },
      { speaker: "marcus", text: "Ground Lease \u2014 tenant leases only the land and builds on it. Escalation Clauses handle rent increases, often tied to CPI." },
      { speaker: "marcus", text: "Percentage Leases have base rent plus a percentage above a breakpoint. And understand usable vs rentable square feet \u2014 the ratio is called the Load Factor." }
    ],
    learn: { title: "Commercial Leases", emoji: "\ud83d\udcdd",
      cards: [
        { title: "Net Lease Tiers", text: "<b>Net</b> = some expenses. <b>Double Net</b> = taxes + insurance. <b>Triple Net (NNN)</b> = taxes + insurance + maintenance." },
        { title: "Ground Lease", text: "Tenant leases <b>land only</b> and builds on it. Improvements revert to landowner." },
        { title: "Percentage Lease", text: "<b>Base rent + % of gross sales above breakpoint</b>." },
        { title: "Escalation & CPI", text: "<b>Escalation Clause</b> = rent increases. Often tied to <b>Consumer Price Index</b>." },
        { title: "Load Factor", text: "<b>Usable</b> = actual space. <b>Rentable</b> = includes common areas. Ratio = <b>Load Factor</b>." }
      ]
    },
    challenge: { setup: "$3,000/mo base rent + 6% of gross sales above $600,000 breakpoint. Store grossed $750,000.",
      q: "What is total annual rent?",
      a: ["$36,000", "$45,000", "$81,000", "$45,900"],
      correct: 1, why: "Base: $3K \u00d7 12 = $36K. Sales over breakpoint: $750K - $600K = $150K. 6% of $150K = $9K. Total: $45,000.",
      right: "\"$36K base plus $9K percentage rent = $45,000 total.\"",
      wrong: "\"$36K base + 6% of the $150K above breakpoint ($9K) = $45,000.\""
    }
  },
],

// ===== CHAPTER 18: INCOME TAX (1 scene) =====
18: [
  { day: 22, title: "The Tax Factor", location: "CPA Office \u2014 Pelham Parkway",
    narrative: [
      { speaker: "narrator", text: "Marcus introduces Denise to a CPA who works with real estate investors." },
      { speaker: "marcus", text: "Short-term capital gains \u2014 held less than a year \u2014 are taxed at ordinary income rates. Long-term \u2014 over a year \u2014 get a lower rate." },
      { speaker: "marcus", text: "Primary residence exclusion: $250K single, $500K married \u2014 if you lived there 2 of the last 5 years." },
      { speaker: "marcus", text: "Depreciation recapture gets taxed when you sell. A 1031 Exchange defers both gains and recapture. Mortgage interest and points are tax deductible." }
    ],
    learn: { title: "Income Tax & Real Estate", emoji: "\ud83e\udded",
      cards: [
        { title: "Capital Gains", text: "<b>Short Term</b> (&lt;1 year) = ordinary rates. <b>Long Term</b> (&gt;1 year) = lower rate." },
        { title: "Primary Residence Exclusion", text: "Exclude <b>$250K single / $500K married</b>. Must live there <b>2 of last 5 years</b>." },
        { title: "Depreciation Recapture", text: "Previously claimed depreciation is <b>recaptured and taxed</b> when you sell." },
        { title: "Deductions", text: "<b>Mortgage interest</b> and <b>points</b> are <b>tax deductible</b>." }
      ]
    },
    challenge: { setup: "Married couple bought at $400K, selling at $850K, lived there 3 years.",
      q: "How much of the gain is taxable?",
      a: ["$450,000", "$0", "$200,000", "$50,000"],
      correct: 1, why: "Gain = $450K. Married exclusion = $500K. $450K < $500K = $0 taxable.",
      right: "\"$450K gain is under the $500K married exclusion. Zero taxes owed.\"",
      wrong: "\"The gain is $450K but the $500K married exclusion covers it all. $0 taxable.\""
    }
  },
],

// ===== CHAPTER 19: MORTGAGE BROKERAGE & MANAGEMENT (2 scenes) =====
19: [
  { day: 23, title: "The Mortgage Middle", location: "Mortgage Brokerage \u2014 Grand Concourse",
    narrative: [
      { speaker: "narrator", text: "Marcus and Denise visit a busy mortgage brokerage office." },
      { speaker: "marcus", text: "A Mortgage Broker connects borrowers with lenders. They're licensed through the NMLS \u2014 Nationwide Multistate Licensing System." },
      { speaker: "marcus", text: "RESPA \u2014 Real Estate Settlement Procedures Act \u2014 prohibits kickbacks and unearned referral fees." },
      { speaker: "marcus", text: "Under TRID, borrowers get a Loan Estimate within 3 days of application and a Closing Disclosure at least 3 business days before closing." }
    ],
    learn: { title: "Mortgage Brokerage", emoji: "\ud83c\udfe6",
      cards: [
        { title: "Mortgage Broker", text: "Intermediary between <b>borrowers and lenders</b>. Licensed through <b>NMLS</b>." },
        { title: "RESPA", text: "<b>Prohibits kickbacks</b> and unearned referral fees in settlement." },
        { title: "TRID Disclosures", text: "<b>Loan Estimate</b> within 3 days. <b>Closing Disclosure</b> at least <b>3 business days</b> before closing." }
      ]
    },
    challenge: { setup: "A mortgage broker offers an agent $500 for every buyer referral who closes.",
      q: "This violates which law?",
      a: ["TILA", "RESPA", "ECOA", "Fair Housing Act"],
      correct: 1, why: "RESPA prohibits kickbacks for referrals in real estate settlements.",
      right: "\"Textbook RESPA violation. Kickbacks for referrals are illegal.\"",
      wrong: "\"That's a kickback prohibited by RESPA. No pay for referrals.\""
    }
  },
  { day: 23, title: "Managing the Building", location: "Property Management \u2014 Westchester Avenue",
    narrative: [
      { speaker: "narrator", text: "Their final stop is a property management firm overseeing dozens of buildings." },
      { speaker: "marcus", text: "A Property Manager is a fiduciary of the owner. Everything is governed by a Management Agreement." },
      { speaker: "marcus", text: "Security deposits go in a separate trust account \u2014 never commingled with operating funds. Return deposits within a reasonable time." },
      { speaker: "marcus", text: "The landlord has a duty of habitability \u2014 maintain the property in livable condition. Heat, hot water, working plumbing." }
    ],
    learn: { title: "Property Management", emoji: "\ud83d\udd11",
      cards: [
        { title: "Fiduciary Role", text: "Property Manager is a <b>fiduciary</b> of the owner. Authority defined by <b>Management Agreement</b>." },
        { title: "Core Duties", text: "<b>Collect rent, coordinate repairs, keep financial records</b>." },
        { title: "Security Deposits", text: "Must be in <b>separate trust account</b>. <b>Never commingle</b>. Return within <b>reasonable time</b>." },
        { title: "Habitability", text: "Landlords must maintain <b>livable conditions</b>: heat, hot water, plumbing, pest-free." }
      ]
    },
    challenge: { setup: "A property manager deposits a tenant's $2,000 security deposit into the company's general operating account.",
      q: "What violation is this?",
      a: ["Breach of habitability", "Commingling of funds", "RESPA violation", "Constructive eviction"],
      correct: 1, why: "Security deposits must be in a separate trust account. Mixing with operating funds is commingling.",
      right: "\"That's commingling. Tenant funds must stay in a separate trust account.\"",
      wrong: "\"Commingling \u2014 mixing tenant deposits with operating funds. Serious violation.\""
    }
  },
],

};
