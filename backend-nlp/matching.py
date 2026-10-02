import re
from typing import List, Dict, Any, Optional

def normalize_skill(s: str) -> str:
    return s.strip().lower()

def compute_skill_overlap(student_skills: List[str], required_skills: List[str], preferred_skills: List[str]):
    student_set = {normalize_skill(s) for s in student_skills}
    matched_req = [s for s in required_skills if normalize_skill(s) in student_set]
    matched_pref = [s for s in preferred_skills if normalize_skill(s) in student_set]
    missing_req = [s for s in required_skills if normalize_skill(s) not in student_set]

    total_req = len(required_skills)
    if total_req == 0:
        skill_score = 0.8
    else:
        req_score = len(matched_req) / float(total_req)
        pref_bonus = min(0.2, (len(matched_pref) * 0.1))
        skill_score = min(1.0, req_score + pref_bonus)

    all_matched = matched_req + matched_pref
    return skill_score, all_matched, missing_req

def match_single_opportunity(student_context: Dict[str, Any], opp: Dict[str, Any]) -> Dict[str, Any]:
    student_skills = student_context.get("skills", [])
    target_roles = [r.lower() for r in student_context.get("targetRoles", [])]
    student_locations = [l.lower() for l in student_context.get("preferredLocations", [])]
    grad_year = student_context.get("graduatingYear", 2027)

    required_skills = opp.get("requiredSkills", [])
    preferred_skills = opp.get("preferredSkills", [])
    opp_title = opp.get("title", "").lower()
    opp_loc = opp.get("location", "").lower()
    opp_work_mode = opp.get("workMode", "remote").lower()

    # 1. Skill Overlap (Weight: 40%)
    skill_score, matched_skills, missing_skills = compute_skill_overlap(
        student_skills, required_skills, preferred_skills
    )

    # 2. Semantic & Role Alignment (Weight: 25%)
    role_score = 0.5
    for target in target_roles:
        # Check title token overlap with target role
        target_words = set(re.findall(r'\w+', target))
        title_words = set(re.findall(r'\w+', opp_title))
        if target_words & title_words:
            role_score = max(role_score, 0.95)
        elif any(w in opp_title for w in ["software", "engineer", "developer", "intern"]):
            role_score = max(role_score, 0.75)

    # 3. Location / Work Mode Compatibility (Weight: 15%)
    location_score = 0.5
    if opp_work_mode == "remote":
        location_score = 1.0
    else:
        for pref in student_locations:
            if pref in opp_loc or "bengaluru" in opp_loc or "hyderabad" in opp_loc:
                location_score = 0.95
                break

    # 4. Experience & Graduation Year Compatibility (Weight: 20%)
    exp_score = 0.8
    opp_eligibility = opp.get("eligibility", "").lower()
    if str(grad_year) in opp_eligibility or "college" in opp_eligibility or "undergraduate" in opp_eligibility:
        exp_score = 1.0
    elif opp.get("experienceLevel") in ["student", "fresher", "entry_level"]:
        exp_score = 0.9

    # Weighted Overall Relevance Estimate (0 to 100)
    relevance_raw = (
        (skill_score * 0.40) +
        (role_score * 0.25) +
        (location_score * 0.15) +
        (exp_score * 0.20)
    )
    relevance_score = int(round(relevance_raw * 100))

    # Relevance Tier
    if relevance_score >= 85:
        tier = "exceptional"
    elif relevance_score >= 70:
        tier = "strong"
    else:
        tier = "moderate"

    # Eligibility Status (Separate from relevance estimate!)
    eligibility_status = "confirmed_eligible"
    eligibility_notes = f"Eligible for {grad_year} graduation cohort ({opp.get('eligibility', 'Verified campus criteria')})"
    if "final year" in opp_eligibility and grad_year > 2026:
        eligibility_status = "likely_eligible"
        eligibility_notes = "Requires final-year status; verify graduation timeline"

    # Explainable Rationale
    matched_summary = ", ".join(matched_skills[:3]) if matched_skills else "general engineering foundation"
    rationale = (
        f"Strong alignment with your validated competency in {matched_summary}. "
        f"Position matches your career target and {opp.get('workMode', 'remote')} work mode preference."
    )

    return {
        "opportunity": opp,
        "relevanceScore": relevance_score,
        "relevanceTier": tier,
        "eligibilityStatus": eligibility_status,
        "eligibilityNotes": eligibility_notes,
        "matchRationale": rationale,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "interestAlignment": f"Matches target direction: {', '.join(student_context.get('targetRoles', ['Software Engineering'])[:2])}",
        "workModeAlignment": f"{opp.get('workMode', 'remote').capitalize()} ({opp.get('location', 'India')})",
        "suggestedAction": f"Highlight your {matched_skills[0] if matched_skills else 'core'} coursework when submitting your portfolio"
    }

def rank_opportunities_for_student(student_context: Dict[str, Any], opportunities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Match, rank and explain opportunities for a student profile"""
    published = [o for o in opportunities if o.get("status") == "published"]
    results = []
    for opp in published:
        match_data = match_single_opportunity(student_context, opp)
        results.append(match_data)

    # Sort descending by relevance score
    results.sort(key=lambda x: x["relevanceScore"], reverse=True)
    return results
