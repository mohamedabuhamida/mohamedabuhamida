{/* 5. ACHIEVEMENTS SECTION */}
{/* 
    Remove the [h-250vh] and the inner sticky wrapper. 
    The Achievements component now handles its own sticky logic 
    internally for each card.
*/}
<section id="achievements" className="relative bg-black border-t border-white/5 shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
  <Achievements achievements={achievements} />
</section>

{/* 6. CERTIFICATIONS SECTION */}
<StickySection className="bg-linear-to-tr from-bg to-primary/10 shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
  <SectionHeader title="Certifications" accent="" />
  <div className="w-full max-w-5xl px-4">
    <Certifications certificates={certificates} />
  </div>
</StickySection>