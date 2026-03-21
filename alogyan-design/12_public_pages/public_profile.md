# Screen: Public Teacher Profile

The Public Profile acts as a landing page for teachers to showcase their expertise, collect leads, and be discovered by new students on the Alogyan platform.

## 1. Layout
- **Type:** Public Facing Web Page (Single Column, highly responsive).
- **Header:** Clean, branding (Teacher's Logo or Alogyan logo).
- **Hero Section:** Teacher Photo, Name, Subject Specialization, Tagline, and Primary CTA ("Book Trial" / "Contact").
- **Body Sections:**
  - About Me / Bio.
  - Experience & Qualifications.
  - Gallery (Photos of classroom, past results).
  - Reviews / Testimonials.
  - Offered Batches/Courses (Cards showing current openings).
- **Footer:** Social links, contact info, location map.

## 2. Components
- **Teacher Bio Card:** Prominent visual hierarchy, prioritizing trust (Verified Badges, Years of Exp).
- **Testimonial Carousel/Grid:** Clean quote marks, star ratings, and student names.
- **Batch Cards:** Similar to the admin batch cards but tailored for public viewing. Displays Subject, Timings, "X seats left", and a clear "Apply to Join" action.

## 3. Tables
- Usually avoided for public layouts unless listing extensive fee structures, in which case a clean grid table is used.

## 4. Forms
- **Lead Generation/Contact Form (Action from CTA):**
  - Name, Phone Number, Selected Grade/Subject, Custom Message.
  - Submit Button -> Sends a notification to the teacher's dashboard.

## 5. Buttons
- **Hero Primary:** "Enquire Now" or "Book a Free Trial" (Primary Red).
- **Ghost Actions:** "Share Profile", "View Location".

## 6. UX Flow (Student Discovery)
1. Student clicks a link found on Google or social media.
2. Lands on the Teacher Profile.
3. Scrolls through Bio, sees impressive Past Results.
4. Finds an open Batch ("Class 10 Math Weekend").
5. Clicks "Apply to Join".
6. Fills out the lead form.
7. Success message ("The teacher will contact you shortly.").

## 7. Mobile Layout
- High priority mobile optimization since 80%+ traffic will be mobile.
- CTA button ("Enquire Now") becomes sticky at the bottom of the viewport so it is always accessible while scrolling through lengthy bios.
- Images scale to full width. Text padding increases for readability.

## 8. Empty States
- If the teacher hasn't filled out a section (e.g., Gallery), that section automatically hides rather than showing an empty placeholder to the public.

## 9. Success States
- Form submission changes the modal to a large green checkmark illustration with "We've received your request!"

## 10. Error States
- Form Validation: "Please enter a valid 10-digit mobile number." (Using friendly, clear language).
