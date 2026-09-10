/* Bias content — en-us.
   Citations are NOT stored here; they live in assets/data/atlas.js and stay in
   their original language. Registered as CBA.registerContent("en-us", ...). */
window.CBA.registerContent("en-us", {
  "availability-heuristic": {
    "name": "Availability heuristic",
    "definition": "Overestimating an event's likelihood because examples are easy to retrieve.",
    "examples": [
      "After watching extensive news coverage of a plane crash, a traveler judges flying to be more dangerous than driving, despite road deaths being much more common.",
      "A manager recalls two recent publicized employee theft cases and assumes theft is widespread in the company without checking incident rates.",
      "After a friend is diagnosed with a rare illness, someone begins to believe that illness is common in their town.",
      "A voter estimates that crime is rapidly rising because several dramatic crimes were recently reported, without comparing official rates over time.",
      "After seeing viral videos of shark attacks, a beachgoer overestimates the probability of being attacked while swimming."
    ],
    "application": "Marketing uses emotional, repetitive content so product information comes to mind easily; heavy media coverage makes the public overestimate rare risks such as plane crashes and shark attacks; investors overestimate startup success rates because of the success stories around them.",
    "debiasing": "Look up base rates and official statistics, and replace recall-by-gut-feel with reference class forecasting. Ask yourself: is this easy to remember, or is it actually common?"
  },
  "availability-cascade": {
    "name": "Availability cascade",
    "definition": "A public claim acquires apparent credibility through repeated circulation, reporting, and discussion.",
    "examples": [
      "A rumor repeated on social media is eventually treated as common knowledge even though no primary source supports it.",
      "Several news outlets report a claim by citing one another, and audiences infer that many independent sources verified it.",
      "Repeated claims that a food ingredient is dangerous increase public concern despite weak evidence.",
      "An organization repeatedly discusses a hypothetical threat until staff begin treating it as an established risk.",
      "A politician's slogan becomes persuasive mainly because audiences have heard it many times."
    ],
    "application": "Media and public relations can set the agenda through sheer repetition; moral panics and investment manias often form this way. Inside an organization, repeatedly discussing a hypothetical threat leads members to treat it as a confirmed risk.",
    "debiasing": "Separate \"often mentioned\" from \"supported by evidence\"; make base rates and evidence grades explicit labelling."
  },
  "frequency-illusion-(baader-meinhof-phenomenon)": {
    "name": "Frequency illusion (Baader–Meinhof phenomenon)",
    "definition": "After first noticing something, a person perceives it as unusually frequent.",
    "examples": [
      "After learning a new word, a student notices it in several articles that week and concludes it has suddenly become fashionable.",
      "After buying a particular car model, a driver starts seeing that model everywhere and assumes sales have exploded.",
      "After hearing a song once, a person notices it in stores and videos and believes it is being played unusually often.",
      "After a friend announces a pregnancy, someone notices pregnant people more often and infers a baby boom.",
      "After reading about a health condition, a person notices similar symptoms in many acquaintances and assumes the condition is widespread."
    ],
    "application": "After a product ships a new feature users feel it is \"everywhere\"; marketing exploits repeated exposure to manufacture familiarity. Most of the effect is selective attention rather than real growth.",
    "debiasing": "Recognise that selective attention is at work; verify impressions against objective data such as install counts or market share."
  },
  "salience-bias": {
    "name": "Salience bias",
    "definition": "Prominent, vivid, or emotionally striking information receives more weight than less noticeable but relevant information.",
    "examples": [
      "A hiring panel focuses on a candidate's charismatic presentation and ignores stronger evidence in the work sample.",
      "A judge gives disproportionate weight to a dramatic courtroom anecdote compared with a large body of documentary evidence.",
      "A consumer chooses a product because its packaging is striking, overlooking a worse warranty and reliability record.",
      "A team focuses on one highly visible outage while ignoring numerous smaller failures that collectively cause more harm.",
      "A student remembers the most shocking point in a lecture but overlooks the statistical qualification that changes its meaning."
    ],
    "application": "A single dramatic event such as one major outage drowns out aggregate data about many small failures; in interviews, a fluent candidate can mask hard evidence from the work sample.",
    "debiasing": "Go back to base rates and the whole picture; split the decision into several independent ratings so one vivid feature cannot drive everything."
  },
  "identifiable-victim-effect": {
    "name": "Identifiable-victim effect",
    "definition": "A specific, recognizable individual evokes more assistance or concern than statistical descriptions of many people.",
    "examples": [
      "Donors give more after reading the story and seeing the photo of one named child than after seeing a chart about thousands of children in need.",
      "A city council funds a service after a resident gives emotional testimony, despite broader data already showing the same need.",
      "A news audience reacts intensely to one rescue story but pays little attention to a larger ongoing crisis without named individuals.",
      "An employer makes an exception to a policy after meeting one affected worker but ignores aggregate evidence of widespread impact.",
      "A student feels compelled to help a single injured animal shown in a video but remains indifferent to habitat-wide mortality statistics."
    ],
    "application": "Fundraisers raise more with the story and photo of one named child than with a chart about thousands; news audiences react intensely to a single rescue story while ignoring a larger ongoing crisis.",
    "debiasing": "Present statistics and individual cases together; when deciding, compare \"how the case feels\" with \"systemic impact\" explicitly."
  },
  "negativity-bias": {
    "name": "Negativity bias",
    "definition": "Negative material receives disproportionate attention, weighting, and often recall.",
    "examples": [
      "A worker receives nine positive performance comments and one criticism, then spends the evening thinking only about the criticism.",
      "A customer reads dozens of favorable reviews but decides not to buy after seeing one vivid negative review.",
      "A person remembers one insulting remark from a party more clearly than many friendly conversations.",
      "A school board gives greater attention to a single complaint than to a much larger volume of positive feedback.",
      "An investor reacts more strongly to a small temporary loss than to an equal-sized gain."
    ],
    "application": "One vivid negative review can cancel out dozens of positive ones; bad news receives far more media exposure than good news; fear-based marketing exploits the effect.",
    "debiasing": "Deliberately balance the frame; design feedback to present positives and negatives side by side and give them equal weight at evaluation time."
  },
  "anchoring-bias": {
    "name": "Anchoring bias",
    "definition": "An initial number or piece of information unduly shapes later judgment.",
    "examples": [
      "A seller lists a used laptop at $2,000; even after learning comparable models sell for $1,200, buyers negotiate around the initial price.",
      "A charity asks whether a person would donate $100 before asking for any amount; the final donation tends to be higher than if it first asked about $10.",
      "A recruiter hears an applicant's prior salary and uses it as the main basis for a new offer despite different responsibilities.",
      "A medical estimate is influenced by the first diagnosis suggested, even after later evidence points elsewhere.",
      "A student guesses that a historical event occurred in 1700 and then adjusts only slightly after reconsidering, though 1500 is more plausible."
    ],
    "application": "Whoever names the first number in a negotiation gains the advantage, as with struck-through list prices; retail uses a \"manufacturer's suggested price\" as an anchor; default values in a form strongly steer what people enter.",
    "debiasing": "Research and write down your own estimate before negotiating; compare several sources; never treat the other side's first number as your baseline."
  },
  "status-quo-bias": {
    "name": "Status quo bias",
    "definition": "The current option is favored simply because it is the existing default.",
    "examples": [
      "Employees remain in an unsuitable retirement plan because it was the default enrollment option.",
      "A household keeps paying for an unused subscription because canceling requires an active decision.",
      "A school retains an ineffective procedure largely because it has been used for years.",
      "Voters support an existing policy mainly because change feels risky, even after costs and benefits shift.",
      "A computer user continues using insecure software because migrating files feels burdensome."
    ],
    "application": "Subscriptions that renew automatically by default, default pension plans, organizations keeping inefficient processes — choice architecture determines behavior directly.",
    "debiasing": "Make change the default or force an active decision point; review periodically whether the existing option is still the best one."
  },
  "endowment-effect": {
    "name": "Endowment effect",
    "definition": "Ownership increases subjective value beyond what one would pay to obtain the same item.",
    "examples": [
      "A person demands $100 to sell a concert ticket they received but would not have paid more than $60 to buy it.",
      "A homeowner prices a house above comparable sales because of personal memories attached to it.",
      "A gamer refuses a fair in-game trade for an item they own but would not acquire that item at the proposed trade value.",
      "A collector values a mug more highly immediately after it is assigned to them in an experiment.",
      "A team resists replacing its existing software because it already feels like \"our system,\" despite a better alternative."
    ],
    "application": "Users find it harder to give up a product once the free trial ends; homeowners overprice because of emotional attachment; in negotiations both sides overvalue what they already hold.",
    "debiasing": "Adopt a third-party view: if I did not own this yet, how much would I pay to acquire it?"
  },
  "loss-aversion": {
    "name": "Loss aversion",
    "definition": "Equivalent losses have a stronger psychological impact than gains.",
    "examples": [
      "A person declines a 50–50 gamble to win $100 or lose $100 because the possible loss feels worse than the possible gain feels good.",
      "A worker is more upset by losing a $500 bonus than pleased by gaining a new $500 bonus.",
      "An investor holds a losing stock to avoid realizing the loss.",
      "A customer reacts more angrily to a $10 surcharge than positively to an equivalent $10 discount.",
      "A department rejects a beneficial reorganization because it would require giving up a familiar minor privilege."
    ],
    "application": "Investors hold losing positions rather than realize the loss; \"limited-time offer ending soon\" marketing exploits the fear of losing; a loss hurts roughly twice as much as an equal-sized gain pleases.",
    "debiasing": "Reframe the situation as a gain; set mechanical stop-loss rules in advance."
  },
  "framing-effect": {
    "name": "Framing effect",
    "definition": "Equivalent information produces different choices when stated as gains, losses, survival, or mortality.",
    "examples": [
      "Patients choose a treatment described as having a 90% survival rate more often than the same treatment described as having a 10% mortality rate.",
      "A manager supports a project when it is presented as saving 200 jobs but not when it is presented as failing to save 50 jobs.",
      "Consumers prefer meat labeled \"90% lean\" rather than \"10% fat.\"",
      "People favor a public-health program described as preventing deaths more than the same program described in terms of unavoidable deaths.",
      "A student sees a 90% score as disappointing when framed as \"10% wrong\" but successful when framed as \"90% correct.\""
    ],
    "application": "In medical communication, the same treatment is preferred when described as \"90% survival\" rather than \"10% mortality\"; \"90% lean\" beats \"10% fat\" on labels; a policy wins more support when described as \"saving 200 jobs\".",
    "debiasing": "Present both frames side by side; require decisions to rest on the raw numbers rather than the framing language."
  },
  "confirmation-bias": {
    "name": "Confirmation bias",
    "definition": "Evidence search, interpretation, and recall favor prior beliefs.",
    "examples": [
      "A person who believes a supplement works searches for success stories but avoids systematic reviews reporting null effects.",
      "A manager convinced a worker is unreliable notices late arrivals but ignores repeated early completion of assignments.",
      "A researcher gives more attention to analyses that support a favored hypothesis than to robustness checks that weaken it.",
      "A sports fan interprets ambiguous referee calls as unfair only when they disadvantage their team.",
      "A voter shares articles supporting their candidate without checking them as rigorously as articles criticizing the candidate."
    ],
    "application": "Investors read only the favorable news; managers remember an employee's late arrivals but not the many early completions; algorithms and like-minded circles reinforce existing beliefs.",
    "debiasing": "Consider the opposite: actively look for disconfirming evidence and give it weight. Appoint a red team to challenge the prevailing view."
  },
  "selective-exposure": {
    "name": "Selective exposure",
    "definition": "People choose sources and environments that reinforce existing beliefs while avoiding discordant information.",
    "examples": [
      "A person subscribes only to media outlets that agree with their political position.",
      "A student reads only articles favorable to a proposed thesis and avoids competing theoretical accounts.",
      "A company consults only vendors likely to endorse a decision it has already made.",
      "A diet follower joins online groups that celebrate the diet but leaves groups that discuss its limitations.",
      "A community leader invites only supporters to a public meeting, then treats the resulting consensus as representative."
    ],
    "application": "Subscribing only to news outlets that share your position; a team consulting only vendors who will endorse a decision already made; algorithmic filter bubbles.",
    "debiasing": "Deliberately subscribe to heterogeneous sources; appoint a devil's advocate to bring in opposing material before deciding."
  },
  "choice-supportive-bias": {
    "name": "Choice-supportive bias",
    "definition": "After making a choice, one remembers the chosen option as better and rejected options as worse than they were.",
    "examples": [
      "After selecting one university, a student later remembers it as having had clearly better faculty than it actually did.",
      "A buyer recalls the strengths of the car they purchased but forgets its weaknesses and the alternative's strengths.",
      "A committee remembers its selected vendor as having offered the best price even though another vendor was cheaper.",
      "A voter later remembers their chosen candidate's platform as more detailed and realistic than it was.",
      "A traveler remembers the chosen hotel as having superior reviews after the trip, despite comparable ratings among alternatives."
    ],
    "application": "Post-purchase rationalization: buyers remember the strengths of the car they bought and forget its weaknesses and the alternative's strengths; memories of a chosen school or candidate are flattering in the same way.",
    "debiasing": "Record your reasons and the comparison with alternatives at the moment of decision; when reviewing later, defer to that record."
  },
  "continued-influence-effect": {
    "name": "Continued influence effect",
    "definition": "Corrected misinformation continues to shape reasoning and memory.",
    "examples": [
      "After a news report falsely attributes a fire to arson and later corrects the claim, people still cite arson when explaining the fire.",
      "A student continues using an outdated statistic in an essay after learning it was erroneous.",
      "A manager remembers that a supplier had a safety violation even after the original report is formally retracted.",
      "An audience retains a false claim from a headline despite reading a correction in the article.",
      "A family continues avoiding a food because of a debunked health rumor."
    ],
    "application": "Even after a news outlet retracts a story, readers go on explaining the event with the original false information; inside an organization, a formally withdrawn report still shapes managers' view of a supplier.",
    "debiasing": "When correcting, state the accurate version explicitly and attribute it. Crisis communication should replace the false narrative, not merely delete it."
  },

  "apophenia": {
    "name": "Apophenia",
    "definition": "Perceiving meaningful connections among unrelated events.",
    "examples": [
      "A person sees a sequence of unrelated inconveniences as evidence that the universe is sending a warning.",
      "An investor interprets several coincidental market movements as proof of a hidden coordinated plan.",
      "A traveler treats repeated sightings of the same number as a message rather than a coincidence.",
      "A manager infers sabotage from two unrelated technical failures without evidence of a common cause.",
      "A student treats coincidental overlap between a dream and a later event as predictive evidence."
    ],
    "application": "Reading a run of unrelated inconveniences as \"the universe warning me\"; investors treating coincidental market moves as evidence of a hidden plan; one cognitive root of conspiracy thinking.",
    "debiasing": "Use statistical tests to separate pattern from randomness; record predictions and check the hit rate."
  },
  "pareidolia": {
    "name": "Pareidolia",
    "definition": "Seeing recognizable forms or sounds in vague, random, or ambiguous stimuli.",
    "examples": [
      "Seeing a face in cloud formations.",
      "Hearing hidden words in a song played backward.",
      "Seeing an animal shape in a stain on a wall.",
      "Interpreting random visual noise on a screen as a human figure.",
      "Hearing a name in the sound of a running fan."
    ],
    "application": "Seeing faces or animals in clouds, wall stains and random noise; advertising and brand design exploit the mechanism to create memorable images.",
    "debiasing": "Understand that this is over-matching by the visual system and is usually harmless; when using it in design, make sure it does not mislead factual judgement."
  },
  "clustering-illusion": {
    "name": "Clustering illusion",
    "definition": "Treating ordinary random clumps or streaks as meaningful patterns.",
    "examples": [
      "Seeing five heads in a row and concluding a coin is biased without considering expected streaks in random sequences.",
      "Assuming a cluster of cancer cases in a neighborhood proves a local cause before comparing rates and population structure.",
      "Interpreting a short run of successful trades as evidence of a reliable trading strategy.",
      "Seeing several students with the same first letter in their names in one classroom and inferring nonrandom assignment.",
      "Treating several storms in one month as proof of a lasting climate shift without examining longer records."
    ],
    "application": "A short winning streak convinces a trader they have found a reliable strategy; a neighborhood cancer cluster has to be checked against population structure and base rates before inferring a local cause.",
    "debiasing": "Accept that random sequences naturally contain clusters; test any apparent pattern against long-run data and statistical tests."
  },
  "gamblers-fallacy": {
    "name": "Gambler's fallacy",
    "definition": "Assuming past independent random outcomes alter the odds of the next outcome.",
    "examples": [
      "Expecting tails to be \"due\" after five consecutive heads.",
      "Choosing a lottery number because it has not appeared recently.",
      "Thinking a roulette color is more likely after a long run of the opposite color.",
      "Expecting a random number generator to compensate after several high values.",
      "Assuming a die is likely to roll a six because it has not rolled one lately."
    ],
    "application": "Backing tails as \"due\" after five heads; avoiding lottery numbers that came up recently — independent events never compensate.",
    "debiasing": "Remember that independent events share no causal link; judge the next round with probability theory rather than intuition."
  },
  "hot-hand-fallacy": {
    "name": "Hot-hand fallacy",
    "definition": "Assuming that a success streak in a random process makes further success more likely.",
    "examples": [
      "Betting that a basketball player must make the next free throw because they made the last five.",
      "Increasing a wager after several winning roulette spins because one feels \"on a streak.\"",
      "Selecting a stock because it rose for several consecutive days without considering baseline volatility.",
      "Assuming a student will answer the next quiz question correctly because they answered several earlier questions correctly by chance.",
      "Treating a sequence of correct guesses as proof of a paranormal ability without adequate controls."
    ],
    "application": "Betting the next shot goes in after five makes; chasing a stock after several up days. Gilovich and colleagues' classic NBA work shows that shooting sequences are close to random.",
    "debiasing": "Return to base rates and long samples; separate skill from random variation."
  },
  "illusory-correlation": {
    "name": "Illusory correlation",
    "definition": "Perceiving a relationship between variables that are unrelated or only weakly related.",
    "examples": [
      "Believing full moons cause more emergency-room visits after remembering only dramatic nights with both.",
      "Assuming a particular handwriting style predicts dishonesty from a few memorable cases.",
      "Believing a weather pattern causes headaches without comparing symptom rates across comparable days.",
      "Associating a minority group with a rare behavior because confirming instances are salient.",
      "Inferring that a lucky charm improves performance from coincidences after using it."
    ],
    "application": "Full moons and emergency-room visits, handwriting and dishonesty, minority groups and rare behaviors — vivid cases are a major source of stereotypes.",
    "debiasing": "Test correlations against control data; remember that \"memorable\" does not mean \"genuinely correlated\"."
  },
  "stereotyping": {
    "name": "Stereotyping",
    "definition": "Inferring individual traits from group membership without adequate individual evidence.",
    "examples": [
      "Assuming a person will be poor at technology because of their age.",
      "Assuming someone in a particular profession must be extroverted.",
      "Expecting a student to have a certain skill based only on nationality.",
      "Assuming a person has specific political beliefs because of their religion.",
      "Treating a candidate as unfit for a role based on a group-level generalization rather than their record."
    ],
    "application": "Recruitment, promotion and AI training data can all reflect group stereotypes; inferring individual ability from age, profession or nationality.",
    "debiasing": "Use structured interviews and blind résumé review; replace group base rates with individual evidence."
  },
  "halo-effect": {
    "name": "Halo effect",
    "definition": "One favorable trait influences judgments of unrelated traits.",
    "examples": [
      "Assuming an attractive speaker is also more knowledgeable.",
      "Rating an employee as more competent after learning they attended a prestigious university, despite identical work evidence.",
      "Treating a well-designed app as more secure without examining its security practices.",
      "Assuming a famous athlete is qualified to advise on unrelated public policy.",
      "Giving a student higher scores across all rubric categories because the first paragraph was excellent."
    ],
    "application": "Attractive people or graduates of prestigious schools are presumed more competent; performance reviews inflate across the board because the opening paragraph was strong; celebrity endorsement spills over into judgements of product quality.",
    "debiasing": "Score each dimension independently and use multiple raters; keep attractiveness and prestige separate from substantive evidence."
  },
  "ingroup-bias": {
    "name": "Ingroup bias",
    "definition": "Favoring people perceived as members of one's own group.",
    "examples": [
      "Hiring a candidate partly because they attended the same university as the interviewer.",
      "Giving more benefit of the doubt to a coworker from one's own department than to an outsider.",
      "Treating a mistake by one's own political group as understandable while condemning the same mistake by another group.",
      "Sharing resources first with members of a familiar community group.",
      "Evaluating identical proposals more favorably when they come from one's own team."
    ],
    "application": "Interviewers favour alumni of their own school; mistakes by colleagues in one's own department are judged more leniently; resources go to familiar community members first.",
    "debiasing": "Run cross-group cooperative tasks; evaluate against objective criteria with group identity hidden."
  },
  "outgroup-homogeneity-bias": {
    "name": "Outgroup homogeneity bias",
    "definition": "Seeing members of another group as more alike than members of one's own group.",
    "examples": [
      "Saying \"they all think the same\" about a political outgroup while recognizing disagreement within one's own side.",
      "Assuming all members of another culture have the same values.",
      "Remembering several people from an outgroup as interchangeable while readily distinguishing ingroup members.",
      "Treating a whole professional field as ideologically uniform despite evidence of internal variation.",
      "Interpreting one outgroup member's action as representative of everyone in that group."
    ],
    "application": "\"They are all the same\" is a staple of political and cultural conflict; a single member's behavior is taken to represent the entire outgroup.",
    "debiasing": "Increase individualized contact with outgroup members; remind yourself that your own group disagrees just as much."
  },
  "curse-of-knowledge": {
    "name": "Curse of knowledge",
    "definition": "Difficulty imagining the perspective of someone who lacks information one already knows.",
    "examples": [
      "An expert explains a technical process using unexplained jargon to beginners.",
      "A teacher assumes students understand an instruction because it seems obvious after years of practice.",
      "A software designer hides necessary steps because the workflow feels intuitive to the design team.",
      "A manager sends a short acronym-filled email that new employees cannot interpret.",
      "A linguist assumes an audience understands a theoretical distinction without defining the terms."
    ],
    "application": "Experts talk jargon at beginners; UX copy omits steps that feel obvious to the design team; managers send acronym-heavy email that new hires cannot read.",
    "debiasing": "Run novice testing and cognitive walkthroughs; write to the target reader's level and have a real person trial it."
  },
  "projection-bias": {
    "name": "Projection bias",
    "definition": "Assuming future preferences or other people's preferences will match one's current state.",
    "examples": [
      "Grocery shopping while hungry and buying more food than one will want later.",
      "Choosing a vacation activity while enthusiastic about hiking and later preferring rest.",
      "Assuming all coworkers will enjoy a meeting format one personally prefers.",
      "Buying winter clothing during a heat wave because one underestimates how preferences will change with the weather.",
      "Predicting that a current frustration will remain equally intense months later."
    ],
    "application": "Overbuying groceries while hungry; planning a hiking holiday while keen on hiking and then only wanting to rest; decisions made in a heightened emotional state are often regretted.",
    "debiasing": "Build in a cooling-off period; judge from your long-run average state rather than your current mood."
  },
  "planning-fallacy": {
    "name": "Planning fallacy",
    "definition": "Underestimating the time, cost, or complexity of future work.",
    "examples": [
      "Estimating that a report will take two hours when data cleaning alone takes a day.",
      "Planning a home repair for one weekend without accounting for purchasing materials and unexpected complications.",
      "Scheduling a software release without allocating time for testing, revisions, or approval delays.",
      "Assuming a thesis chapter can be drafted in a week despite prior chapters taking a month.",
      "Promising a client delivery date based on the best-case workflow rather than comparable past projects."
    ],
    "application": "Project schedules, software releases and thesis writing all systematically underestimate time and cost; the report that will \"take two hours\" often eats a whole day.",
    "debiasing": "Reference class forecasting: use the actual duration of comparable past tasks as your base rate."
  },
  "optimism-bias": {
    "name": "Optimism bias",
    "definition": "Underestimating personal risk and overestimating favorable outcomes.",
    "examples": [
      "A driver believes accidents are less likely to happen to them than to other drivers.",
      "A startup founder assumes revenue will arrive sooner than realistic market evidence supports.",
      "A student delays studying because they expect to learn everything quickly later.",
      "A homeowner assumes a severe weather event will not affect their property.",
      "A person underestimates the chance that a medical symptom requires professional evaluation."
    ],
    "application": "Around 80% of people consider themselves less likely than average to crash a car, lose a job or fall ill; founders overestimate how quickly revenue arrives.",
    "debiasing": "Run a premortem: assume the project has already failed, work backwards to the likely causes, and block them in advance."
  }
  ,

  "attribute-substitution": {
    "name": "Attribute substitution",
    "definition": "Replacing a difficult target question with an easier, related question.",
    "examples": [
      "Asked whether a policy is effective, a voter instead asks whether they like the politician proposing it.",
      "Asked to estimate a company's long-term value, an investor uses whether they recognize the brand.",
      "Asked which job applicant will perform best, a manager substitutes who gave the most confident interview.",
      "Asked whether a study is methodologically strong, a reader substitutes whether its conclusion feels plausible.",
      "Asked whether a technology is safe, a consumer substitutes whether its interface looks professional."
    ],
    "application": "Evaluating a policy's effectiveness by whether you like the politician proposing it; valuing a company by whether you recognize the brand; judging a technology's safety by whether the interface looks professional.",
    "debiasing": "Notice when substitution happens; break the hard question into quantifiable sub-questions and answer them one by one."
  },
  "ambiguity-effect": {
    "name": "Ambiguity effect",
    "definition": "Preferring known probabilities to options with unknown probabilities.",
    "examples": [
      "Choosing a lottery with a known 20% chance of winning over one with an unknown chance, even when the latter may be better.",
      "Buying a familiar product with a clear warranty rather than a potentially superior new product with uncertain reliability.",
      "Investing in a low-return insured account instead of evaluating a diversified but less familiar option.",
      "Selecting a standardized treatment rather than considering a newer option with less certain outcome data.",
      "Avoiding an unfamiliar job opportunity because the performance criteria are unclear, even when it may offer better prospects."
    ],
    "application": "Consumers prefer a familiar product with a clear warranty even when a new one may be better; investors avoid options with thin information even when expected returns are higher.",
    "debiasing": "Quantify uncertainty as a probability range; compare expected value across known risk and unknown risk."
  },
  "action-bias": {
    "name": "Action bias",
    "definition": "Acting when inaction or further assessment would be more effective.",
    "examples": [
      "A goalkeeper dives left or right on a penalty kick when staying near the center would sometimes yield better odds.",
      "A manager changes a functioning process immediately after one bad week rather than checking whether variation is random.",
      "A doctor orders an unnecessary test to feel proactive despite low expected diagnostic value.",
      "An investor sells during a short decline rather than following a justified long-term plan.",
      "A team adds features to solve a usability problem that would be better addressed by removing complexity."
    ],
    "application": "Goalkeepers dive to one side on penalties when staying near the center sometimes has the higher expected value; managers change a working process after a single bad week.",
    "debiasing": "Keep \"do nothing\" on the list of options; before acting, ask whether the evidence shows action beats observation."
  },
  "additive-bias": {
    "name": "Additive bias",
    "definition": "Trying to solve problems by adding components when subtraction would work better.",
    "examples": [
      "A team adds a new form to reduce errors when removing an unnecessary approval step would do more.",
      "A teacher adds more assignments when simplifying instructions would improve learning.",
      "A software team adds a dashboard widget instead of removing a confusing workflow.",
      "A household buys storage bins when reducing unused possessions would solve the space problem.",
      "A policy maker adds regulations to a process whose main problem is an obsolete requirement."
    ],
    "application": "Teams add a form to reduce errors when removing an unnecessary approval step would do more; stacked features make products complex.",
    "debiasing": "Ask first whether something can be deleted or simplified; make subtraction the first candidate solution."
  },
  "sunk-cost-fallacy": {
    "name": "Sunk-cost fallacy",
    "definition": "Continuing because of irrecoverable past investment rather than expected future value.",
    "examples": [
      "Watching a movie one dislikes because one paid for the ticket.",
      "Continuing an unproductive research direction only because months have already been spent on it.",
      "Keeping a subscription unused because canceling would make past payments feel wasted.",
      "Repairing an unreliable vehicle repeatedly because so much has already been spent on prior repairs.",
      "Remaining in a failing project because abandoning it would make prior effort visible."
    ],
    "application": "Sitting through a bad film because you bought the ticket; continuing to fund a project only because months are already sunk; paying for a subscription nobody uses.",
    "debiasing": "Do a forward-looking evaluation only: ignore what is spent and ask about future expected value. Set mid-course exit checkpoints."
  },
  "escalation-of-commitment": {
    "name": "Escalation of commitment",
    "definition": "Increasing investment in a failing course because of prior investment and a desire to justify it.",
    "examples": [
      "A company funds additional development rounds after repeated evidence that a product has no market.",
      "A government continues a costly program primarily to avoid admitting earlier failure.",
      "A manager assigns more staff to a missed-deadline project without revisiting its assumptions.",
      "A gambler raises stakes after losses to recover earlier losses.",
      "A team expands a poorly designed system instead of replacing it because replacement would concede the original design failed."
    ],
    "application": "Companies keep funding a product with no market; governments continue costly programs mainly to avoid admitting failure; the more personally responsible someone feels, the more they double down.",
    "debiasing": "Separate responsibility by letting someone else make the continue-or-stop call; bring in outside review and preset stopping points."
  },
  "zero-risk-bias": {
    "name": "Zero-risk bias",
    "definition": "Preferring to eliminate a small risk entirely over reducing a much larger risk by more overall.",
    "examples": [
      "Spending a large budget to reduce an already tiny risk from 0.1% to zero while leaving a high-risk hazard untreated.",
      "Choosing a product because it claims \"zero risk\" in one minor category despite worse overall safety.",
      "Focusing all cybersecurity resources on removing one rare vulnerability while ignoring common phishing exposure.",
      "Rejecting a vaccine because it cannot reduce risk to zero, while overlooking the substantial reduction it provides.",
      "Selecting an expensive safety feature that removes a negligible danger instead of investing in a measure that greatly reduces major injuries."
    ],
    "application": "Spending a large budget to cut a tiny 0.1% risk to zero while leaving a high-risk hazard untreated; rejecting a vaccine because it cannot bring risk to zero.",
    "debiasing": "Use cost-benefit analysis to compare the total expected benefit of eliminating a small risk against substantially reducing a large one."
  },
  "risk-compensation-(peltzman-effect)": {
    "name": "Risk compensation (Peltzman effect)",
    "definition": "Increasing risky behavior when a safety measure creates a feeling of greater protection.",
    "examples": [
      "Driving faster because a vehicle has advanced safety features.",
      "Taking riskier cycling routes because one is wearing a helmet.",
      "Trading more aggressively after purchasing portfolio insurance.",
      "Giving less attention to food safety because one assumes a preservative eliminates all risk.",
      "Allowing children more dangerous play without supervision because they are wearing protective gear."
    ],
    "application": "More safety features, faster driving; helmets followed by riskier cycling routes; more aggressive trading after buying portfolio insurance.",
    "debiasing": "Avoid over-signalling safety; pair safety design with risk-awareness education."
  },
  "overconfidence-effect": {
    "name": "Overconfidence effect",
    "definition": "Expressing confidence greater than actual accuracy warrants.",
    "examples": [
      "Giving an answer with 95% confidence that turns out wrong.",
      "A forecaster gives narrow prediction intervals that miss outcomes frequently.",
      "A manager estimates a project's chance of success at 90% without checking comparable failure rates.",
      "A student stops studying because they feel certain they know the material, then performs poorly.",
      "An investor believes they can reliably time the market despite a record no better than chance."
    ],
    "application": "Ventures rated 90% likely to succeed often fail; narrow prediction intervals miss frequently; the Challenger disaster is read as an organizational case of overconfidence.",
    "debiasing": "Calibration training: record forecasts and outcomes and get external feedback. Express uncertainty as intervals rather than point estimates."
  },
  "illusion-of-control": {
    "name": "Illusion of control",
    "definition": "Overestimating personal influence over chance or externally determined outcomes.",
    "examples": [
      "Rolling dice more forcefully when needing a high number.",
      "Believing a lucky routine changes the odds of a random drawing.",
      "Feeling that selecting one's own lottery numbers improves chances.",
      "Believing one can control a market-wide downturn through personal effort alone.",
      "Pressing an elevator button repeatedly as though it will make the elevator arrive faster."
    ],
    "application": "Throwing dice harder when you need a high number; feeling that picking your own lottery numbers improves the odds; pressing the elevator button repeatedly as if it helps.",
    "debiasing": "Separate skill situations from chance situations; for random events use disciplined rules rather than \"feel\"."
  },
  "dunning-kruger-effect": {
    "name": "Dunning–Kruger effect",
    "definition": "Miscalibrated self-assessment associated with limited competence and limited ability to diagnose one's own mistakes.",
    "examples": [
      "A novice language learner claims fluency after mastering basic phrases but cannot sustain unscripted conversation.",
      "A new programmer dismisses code review because they do not recognize security or architecture issues.",
      "A person interprets a few articles as sufficient expertise to reject a complex scientific consensus.",
      "A beginner cook rates their skills very highly without recognizing food-safety or technique errors.",
      "A trainee evaluator gives confident judgments without awareness of the reliability standards they have not learned."
    ],
    "application": "Novice language learners declare themselves fluent; junior programmers dismiss code review; the least competent often place themselves near the 62nd percentile while sitting in the bottom quartile.",
    "debiasing": "Give objective, immediate feedback; build metacognition through training so people learn what they do not know."
  },

  "testing-effect": {
    "name": "Testing effect",
    "definition": "Active retrieval practice produces stronger later recall than passive rereading.",
    "examples": [
      "A student uses practice questions and remembers terms better than after rereading notes.",
      "A language learner recalls vocabulary more reliably after flashcard retrieval than after looking repeatedly at word lists.",
      "A trainee takes a low-stakes quiz and retains safety procedures better than a peer who only rewatched a presentation.",
      "A musician practices recalling a piece from memory and improves retention more than by repeatedly listening to it.",
      "A teacher asks students to explain yesterday's lesson from memory, improving later performance compared with review alone."
    ],
    "application": "Practice questions beat rereading notes for retention; in language learning, flashcard retrieval beats repeatedly scanning word lists.",
    "debiasing": "Design education around retrieval practice: short quizzes instead of passive rereading."
  },
  "spacing-effect": {
    "name": "Spacing effect",
    "definition": "Distributed practice across time improves durable retention more than massed practice.",
    "examples": [
      "Reviewing vocabulary for 15 minutes across several days works better than studying for two hours the night before a test.",
      "A trainee revisits a procedure weekly rather than attending one long annual refresher.",
      "A student schedules several short retrieval sessions before an exam instead of cramming.",
      "A musician practices a difficult passage on multiple days rather than for one uninterrupted evening.",
      "A workplace sends short periodic safety reminders instead of one dense orientation session."
    ],
    "application": "Fifteen minutes of vocabulary review spread over several days beats two hours the night before; spaced repetition is central to language learning and training design.",
    "debiasing": "Schedule learning and safety reminders with spaced repetition."
  },
  "levels-of-processing-effect": {
    "name": "Levels-of-processing effect",
    "definition": "Deep, semantic, elaborative encoding improves memory more than shallow surface processing.",
    "examples": [
      "A learner remembers a word better after using it in a meaningful sentence than after counting its letters.",
      "A student remembers a concept better after explaining why it matters than after copying its definition.",
      "A trainee retains a procedure after solving a realistic case rather than merely highlighting the manual.",
      "A person remembers names better after associating each name with a meaningful personal detail.",
      "A reader recalls an argument better after comparing it to an alternative theory."
    ],
    "application": "Using a word in a meaningful sentence beats counting its letters; explaining why something matters beats copying its definition.",
    "debiasing": "Replace shallow processing with meaningful, elaborative encoding; link content to the learner's own experience."
  },
  "tip-of-the-tongue-phenomenon": {
    "name": "Tip-of-the-tongue phenomenon",
    "definition": "Partial retrieval occurs without successful access to the target word or item.",
    "examples": [
      "A speaker knows a word's first sound and meaning but cannot produce the word.",
      "A person can name an actor's films but cannot recall the actor's name.",
      "A student remembers a formula's use but not its formal name during an exam.",
      "A bilingual speaker can retrieve a translation's initial syllable but not the full word.",
      "A researcher remembers the journal and topic of an article but cannot retrieve the author's name."
    ],
    "application": "Knowing a word's first sound and meaning without being able to produce it; listing an actor's films without recalling the actor's name.",
    "debiasing": "Offer hints and autocomplete in interfaces; relaxation and time raise the chance of successful retrieval."
  },
  "primacy-effect": {
    "name": "Primacy effect",
    "definition": "Items presented early in a sequence are recalled more readily.",
    "examples": [
      "In a ten-item shopping list, a person remembers the first few items best.",
      "A hiring panel remembers the first candidate's strengths more clearly after a long day of interviews.",
      "Students remember the opening concepts of a lecture better than mid-lecture material.",
      "In an introduction round, people more readily recall the first names announced.",
      "A juror gives early testimony disproportionate influence compared with later testimony."
    ],
    "application": "After an interview marathon, managers remember the first candidate best; the opening of a presentation is best retained; list order shapes both memory and choice.",
    "debiasing": "Put key messages at the start of a sequence; rotate the order so every item is treated fairly."
  },
  "recency-effect": {
    "name": "Recency effect",
    "definition": "Items presented last in a sequence are recalled more readily.",
    "examples": [
      "A person remembers the last items on a shopping list best.",
      "A manager's final comment disproportionately shapes an employee's impression of a meeting.",
      "A voter recalls the final debate exchange better than earlier discussion.",
      "A customer evaluates a service interaction largely through its final moment.",
      "A student remembers the final lecture slide better than material in the middle."
    ],
    "application": "The last items on a shopping list are remembered best; a meeting's final comment disproportionately shapes the impression; service ratings are heavily influenced by the final moment.",
    "debiasing": "Place key messages at the end or repeat them there; make sure the ending of a service experience is a good one."
  },
  "misinformation-effect": {
    "name": "Misinformation effect",
    "definition": "Later misleading information alters memory for an original event.",
    "examples": [
      "After viewing a traffic accident, a witness later hears the word \"smashed\" and recalls vehicles as moving faster than they were.",
      "A person remembers a nonexistent weapon after another witness mentions one.",
      "An interviewer asks whether a stop sign was present, and a witness later recalls a stop sign where there was only a yield sign.",
      "A group discussion leads members to adopt one another's inaccurate details as personal memories.",
      "A misleading documentary reenactment changes viewers' memory of the original historical footage."
    ],
    "application": "After hearing the word \"smashed\", witnesses recall vehicles moving faster than they were; suggestive questioning can implant details that never existed, as with the stop sign versus yield sign.",
    "debiasing": "Avoid leading language in legal and interview settings; record the original memory immediately; flag misinformation explicitly."
  },
  "source-confusion": {
    "name": "Source confusion",
    "definition": "Remembering content but misidentifying where it came from.",
    "examples": [
      "A person repeats a claim believing they read it in a peer-reviewed study when it came from a social-media post.",
      "A researcher mistakes an idea heard in a seminar for their own original idea.",
      "A witness confuses a detail from a news report with a detail personally observed.",
      "A student attributes a quotation to the wrong author after reading multiple similar sources.",
      "A person remembers an event from a family story as though they experienced it themselves."
    ],
    "application": "Treating a social-media post as a peer-reviewed study you read; mistaking an idea heard at a seminar for your own original thought.",
    "debiasing": "Train source monitoring; record provenance at the moment you cite something."
  },
  "false-memory": {
    "name": "False memory",
    "definition": "Recalling an event or detail that did not occur, or reconstructing it materially inaccurately.",
    "examples": [
      "A person becomes confident they attended a childhood event after repeatedly seeing photos from it, though they were not present.",
      "A witness remembers a nonexistent detail after repeated suggestive questioning.",
      "A family member recalls a conversation that merged elements from several separate occasions.",
      "A student recalls seeing a term on a study list when it appeared only in a related discussion.",
      "A person remembers a dream as an actual conversation after enough time has passed."
    ],
    "application": "Repeatedly seeing photographs makes people believe they attended a childhood event they were not at; the DRM procedure makes most people \"remember\" a keyword that never appeared.",
    "debiasing": "Check memory against original records such as diaries and video; avoid repeated suggestive recall."
  },
  "hindsight-bias": {
    "name": "Hindsight bias",
    "definition": "After learning an outcome, treating it as having been more predictable than it was.",
    "examples": [
      "After an election result, a person says the winner was obvious despite previously expressing uncertainty.",
      "After a company fails, commentators claim its collapse was inevitable while ignoring evidence of plausible alternative outcomes.",
      "After a storm causes damage, a homeowner claims the severity should have been clear despite ambiguous forecasts.",
      "After a medical diagnosis, a person recalls the symptoms as clearly pointing to it even though several diagnoses were possible.",
      "After a software incident, a team claims the outage warning signs were unmistakable despite not acting on them beforehand."
    ],
    "application": "After an election everyone says they knew the winner would win; after a company fails, commentators call it inevitable; project post-mortems turn vague warning signs into \"obvious in hindsight\".",
    "debiasing": "Record forecasts and reasons in advance; pair premortems with post-mortems so results do not rewrite the process."
  },

  "illusory-truth-effect": {
    "name": "Illusory truth effect",
    "definition": "A repeated statement is judged more credible because of its familiarity, even when it is false.",
    "examples": [
      "After seeing a rumor repeatedly, people feel \"I have heard this before, so it must be true\" even after it has been debunked.",
      "An advertising slogan plays often enough that audiences start believing its claim."
    ],
    "application": "The core mechanism behind repeated advertising exposure, political slogans and the spread of fake news.",
    "debiasing": "Judge credibility by source and evidence, not by familiarity."
  },
  "bias-blind-spot": {
    "name": "Bias blind spot",
    "definition": "Recognizing biases in others while failing to see them in oneself.",
    "examples": [
      "People generally consider themselves more objective than average, even after being told that biases exist.",
      "In a team review, everyone points out other people's confirmation bias but nobody sees their own."
    ],
    "application": "The pervasive \"other people are biased, I am objective\" stance in decision reviews, arbitration and performance appraisal.",
    "debiasing": "Treat yourself as a source of bias too; use structured decision processes that leave bias nowhere to hide."
  },
  "survivorship-bias": {
    "name": "Survivorship bias",
    "definition": "Seeing only the survivors who succeeded and ignoring those who failed, which inflates the apparent success rate of a strategy.",
    "examples": [
      "Studying only successful startups and concluding that boldness wins, while missing the many failures that did the same thing.",
      "Media stories about long-lived people who ate a certain food, ignoring the many who ate the same food and died young."
    ],
    "application": "A sampling blind spot common in investment performance, startup coverage and historical research.",
    "debiasing": "Actively collect failure cases; ask what the denominator is."
  },
  "base-rate-fallacy": {
    "name": "Base rate fallacy",
    "definition": "Ignoring the overall incidence, or base rate, when judging, and relying too heavily on the concrete information in front of you.",
    "examples": [
      "Panicking after a positive screen for a rare disease, ignoring how low its base rate is in the population.",
      "Concluding that crime is worsening after two burglaries in a neighborhood, ignoring that the overall rate is falling."
    ],
    "application": "Medical diagnosis, risk assessment and the evaluation of evidence in law.",
    "debiasing": "Write down the base rate before adding case information; update beliefs with Bayesian reasoning."
  },
  "bandwagon-effect": {
    "name": "Bandwagon effect",
    "definition": "Beliefs or behaviors strengthen because everyone else is doing it.",
    "examples": [
      "The frontrunner in the polls attracts more supporters, making the lead self-fulfilling.",
      "A long queue outside a restaurant convinces passers-by that it must be good."
    ],
    "application": "\"Best-selling\" marketing labels, elections and herd behavior in markets.",
    "debiasing": "Separate popularity from actual quality; evaluate the evidence independently."
  },
  "authority-bias": {
    "name": "Authority bias",
    "definition": "Trusting the opinions of authorities too much, even outside their field of expertise.",
    "examples": [
      "In Milgram's experiments, participants kept administering shocks because of the experimenter's authority.",
      "Fans overlook the fact that a celebrity endorsing a medical product has no medical background."
    ],
    "application": "Advertising endorsements, medical decisions, and \"the expert has spoken\" cultures inside organizations.",
    "debiasing": "Check whether the authority's expertise actually covers the issue; judge by evidence, not by title."
  },
  "mental-accounting": {
    "name": "Mental accounting",
    "definition": "Sorting money into separate mental accounts by source and purpose, violating the principle that money is fungible.",
    "examples": [
      "A tax refund is treated as \"found money\" and spent freely, while the same amount of salary is saved.",
      "Refusing to use a year-end bonus to pay down high-interest card debt because that money is \"for a trip abroad\"."
    ],
    "application": "Consumer finance, financial planning and retail marketing through discount framing.",
    "debiasing": "Treat all money as one pool; decide on total assets and total liabilities."
  },
  "omission-bias": {
    "name": "Omission bias",
    "definition": "Treating harm caused by inaction as more acceptable than harm caused by action.",
    "examples": [
      "Parents skip a vaccine because of side-effect fears, even though the statistical risk of skipping is higher.",
      "Doctors prefer watchful waiting because \"doing nothing\" is less likely to attract blame."
    ],
    "application": "Vaccine hesitancy, medical decisions and regulatory approval, where the cost of inaction is routinely underestimated.",
    "debiasing": "Compare the expected outcomes of acting and not acting, rather than relying on moral intuition."
  },
  "zeigarnik-effect": {
    "name": "Zeigarnik effect",
    "definition": "Unfinished tasks are remembered more readily and occupy more of the mind than completed ones.",
    "examples": [
      "An interrupted phone call is remembered better than one you finished.",
      "Stopping a series at a cliffhanger leaves the plot running through your head."
    ],
    "application": "UX progress bars, episode cliffhangers, and \"free at the start, paid at the end\" marketing design.",
    "debiasing": "Use it to sustain engagement in learning; at work, close tasks explicitly to free up cognitive resources."
  },
  "can-debiasing-be-trained": {
    "name": "Can debiasing be trained?",
    "definition": "A research-frontier topic: a single explanation produces short-term improvement, repeated training produces gains that persist two months later, but transfer to new domains is limited.",
    "examples": [
      "Franiatte and colleagues (2024) found that after repeated training, gains on the bat-and-ball, base-rate and conjunction problems lasted two months.",
      "Korteling and Toet (2021) review evidence that retention and transfer of debiasing interventions remain limited."
    ],
    "application": "Design educational interventions around repetition and context rather than one-off campaigns.",
    "debiasing": "Open-mindedness, rather than cognitive ability, is the best predictor of debiasing success."
  }
});
