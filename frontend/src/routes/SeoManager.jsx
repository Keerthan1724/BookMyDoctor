import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { getDoctorDetails } from "../services/doctorService";
import { getReviews } from "../services/reviewService";

const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

const routesMeta = [
  {
    path: "/",
    title: "BookMyDoctor | Online Doctor Appointment Booking",
    description:
      "BookMyDoctor helps you find trusted doctors and book appointments online with ease. Discover top doctors, specialties, and instant booking options.",
    keywords:
      "book doctor appointment, online doctor booking, healthcare platform, doctor consultation, online appointments",
  },
  {
    path: "/doctors",
    title: "Find Doctors Near You | BookMyDoctor",
    description:
      "Browse available doctors by specialty, ratings, and availability. Book appointments with trusted healthcare professionals on BookMyDoctor.",
    keywords:
      "doctor search, find doctors, healthcare professionals, medical booking, online doctor list",
  },
  {
    path: "/doctordetails/:id",
    title: "Doctor Details | BookMyDoctor",
    description:
      "View detailed doctor profiles, availability, and appointment options. Book a consultation with BookMyDoctor's verified healthcare providers.",
    keywords:
      "doctor profile, doctor details, book appointment, specialist info, medical consultation",
  },
  {
    path: "/contact",
    title: "Contact Us | BookMyDoctor",
    description:
      "Get in touch with BookMyDoctor support for booking help, account questions, or general inquiries about our healthcare platform.",
    keywords:
      "contact BookMyDoctor, customer support, healthcare inquiries, appointment help",
  },
  {
    path: "/faqs",
    title: "FAQs | BookMyDoctor",
    description:
      "Find answers to common questions about booking appointments, payments, cancellations, and using BookMyDoctor's online healthcare platform.",
    keywords:
      "BookMyDoctor FAQ, appointment questions, online doctor booking help, payment questions",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | BookMyDoctor",
    description:
      "Read BookMyDoctor's privacy policy to learn how we protect your personal information and handle data securely on our online health booking platform.",
    keywords:
      "privacy policy, data protection, healthcare privacy, medical booking privacy",
  },
  {
    path: "/terms",
    title: "Terms & Conditions | BookMyDoctor",
    description:
      "Review the terms and conditions for using BookMyDoctor, including appointment booking, payment policies, and user responsibilities.",
    keywords:
      "terms and conditions, user agreement, booking policy, cancellation policy",
  },
  {
    path: "/about",
    title: "About Us | BookMyDoctor",
    description:
      "Learn about BookMyDoctor's mission to simplify healthcare by connecting patients with trusted doctors through seamless online appointment booking.",
    keywords:
      "about BookMyDoctor, healthcare platform, doctor appointment service, medical booking company",
  },
  {
    path: "/login",
    title: "Login | BookMyDoctor",
    description:
      "Sign in to your BookMyDoctor account to manage appointments, access medical bookings, and connect with doctors online.",
    keywords: "login, sign in, BookMyDoctor account, appointment access",
  },
  {
    path: "/register",
    title: "Register | BookMyDoctor",
    description:
      "Create a BookMyDoctor account to book doctor appointments online, manage your profile, and access healthcare services.",
    keywords: "register, sign up, create account, medical booking registration",
  },
  {
    path: "/forgot-password",
    title: "Forgot Password | BookMyDoctor",
    description:
      "Reset your BookMyDoctor password securely if you forgot your credentials and regain access to your appointment dashboard.",
    keywords:
      "forgot password, reset password, account recovery, BookMyDoctor support",
  },
  {
    path: "/verify-otp",
    title: "Verify OTP | BookMyDoctor",
    description:
      "Verify your OTP to complete login or registration on BookMyDoctor and access your doctor appointment booking dashboard.",
    keywords:
      "OTP verification, login security, account verification, BookMyDoctor OTP",
  },
  {
    path: "/reset-password",
    title: "Reset Password | BookMyDoctor",
    description:
      "Set a new password for your BookMyDoctor account after verifying your identity and continue managing your healthcare appointments.",
    keywords:
      "reset password, change password, account security, BookMyDoctor password recovery",
  },
  {
    path: "/profile",
    title: "Profile | BookMyDoctor",
    description:
      "Manage your BookMyDoctor profile, appointment history, and personal details in one secure healthcare booking portal.",
    keywords:
      "profile settings, account management, appointment history, user profile",
  },
  {
    path: "/appointmenthistory",
    title: "Appointment History | BookMyDoctor",
    description:
      "Review your past and upcoming doctor appointments with BookMyDoctor, including booking details and visit history.",
    keywords:
      "appointment history, booking records, past appointments, medical records",
  },
  {
    path: "/payment-preview",
    title: "Payment Preview | BookMyDoctor",
    description:
      "Review your payment details before confirming a doctor appointment booking with BookMyDoctor.",
    keywords: "payment preview, checkout, appointment payment, billing details",
  },
  {
    path: "/payment-success",
    title: "Payment Success | BookMyDoctor",
    description:
      "Your appointment payment was successful. Thank you for booking with BookMyDoctor.",
    keywords:
      "payment success, booking confirmation, appointment payment completed",
  },
  {
    path: "/admin/dashboard",
    title: "Admin Dashboard | BookMyDoctor",
    description:
      "Manage BookMyDoctor admin tasks, doctor listings, appointments, and user activity from the admin dashboard.",
    keywords:
      "admin dashboard, doctor management, appointment admin, user management",
  },
  {
    path: "/admin/adddoctor",
    title: "Add Doctor | BookMyDoctor",
    description:
      "Add new doctor profiles and manage healthcare providers within the BookMyDoctor admin panel.",
    keywords: "add doctor, doctor profile management, health provider admin",
  },
  {
    path: "/admin/appointmentlist",
    title: "Appointment List | BookMyDoctor",
    description:
      "View and manage appointment bookings as an admin with BookMyDoctor's appointment list dashboard.",
    keywords: "appointment list, booking management, admin appointments",
  },
  {
    path: "/admin/doctorlist",
    title: "Doctor List | BookMyDoctor",
    description:
      "Browse and manage the list of registered doctors from the BookMyDoctor admin dashboard.",
    keywords: "doctor list, admin doctor management, provider listings",
  },
  {
    path: "/admin/userlist",
    title: "User List | BookMyDoctor",
    description:
      "View registered users and manage patient accounts through the BookMyDoctor admin interface.",
    keywords: "user list, admin user management, patient accounts",
  },
  {
    path: "/doctor/appointment",
    title: "Doctor Appointments | BookMyDoctor",
    description:
      "Manage doctor appointments, patient bookings, and consultation schedules from the doctor panel.",
    keywords:
      "doctor appointment management, patient bookings, consultation schedule",
  },
  {
    path: "/doctor/dashboard",
    title: "Doctor Dashboard | BookMyDoctor",
    description:
      "Access your doctor dashboard to oversee patient appointments, availability, and profile settings.",
    keywords: "doctor dashboard, clinic management, healthcare provider portal",
  },
  {
    path: "/doctor/profile",
    title: "Doctor Profile | BookMyDoctor",
    description:
      "Manage your doctor profile, availability, and consultation settings in the BookMyDoctor doctor panel.",
    keywords:
      "doctor profile, availability settings, healthcare provider profile",
  },
  {
    path: "/appointment",
    title: "Book Appointment | BookMyDoctor",
    description:
      "Book an appointment with a healthcare provider through BookMyDoctor and manage your consultation schedule.",
    keywords:
      "book appointment, appointment booking, medical consultation booking",
  },
  {
    path: "/review",
    title: "Write a Review | BookMyDoctor",
    description:
      "Leave feedback for your doctor appointment and share your experience on BookMyDoctor.",
    keywords: "doctor review, patient feedback, appointment review",
  },
  {
    path: "/view-review/:id",
    title: "View Review | BookMyDoctor",
    description:
      "Read patient reviews and feedback for doctor consultations on BookMyDoctor.",
    keywords: "view review, doctor feedback, patient testimonials",
  },
];

const dynamicRoutes = [
  {
    path: "/doctordetails/:id",
    async getMeta(params) {
      if (!params?.id) return null;

      try {
        const res = await getDoctorDetails(params.id);
        const doctor = res.data;
        const name = doctor?.username || "Doctor";
        const specialization = doctor?.specialization || "";
        const title = `${name}${specialization ? ` - ${specialization}` : ""} | BookMyDoctor`;
        const description = `Book an appointment with ${name}${specialization ? `, ${specialization}` : ""}. View fees, availability, and reviews on BookMyDoctor.`;

        return {
          title,
          description,
          keywords: `${name}, ${specialization}, book doctor appointment, online doctor booking`,
          ogImage: doctor?.profile_image || `${baseUrl}/og-image.jpg`,
          twitterImage: doctor?.profile_image || `${baseUrl}/og-image.jpg`,
        };
      } catch (error) {
        return null;
      }
    },
  },
  {
    path: "/view-review/:id",
    async getMeta(params) {
      if (!params?.id) return null;

      try {
        const res = await getReviews();
        const reviewId = Number(params.id);
        const review = res.data.find((rev) => {
          if (typeof rev.appointment === "object") {
            return rev.appointment.id === reviewId;
          }
          return rev.appointment === reviewId;
        });

        if (!review) {
          return {
            title: `Review ${params.id} | BookMyDoctor`,
            description: `Read patient feedback for appointment ${params.id} on BookMyDoctor.`,
            keywords: `review, appointment ${params.id}, BookMyDoctor`,
          };
        }

        const title = `Review for Appointment #${params.id} | BookMyDoctor`;
        const description = `Read the patient review for appointment ${params.id} with a trusted doctor on BookMyDoctor.`;

        return {
          title,
          description,
          keywords: `appointment review, patient feedback, appointment ${params.id}, BookMyDoctor`,
        };
      } catch (error) {
        return null;
      }
    },
  },
];

function findMeta(pathname) {
  return (
    routesMeta.find((route) =>
      matchPath({ path: route.path, end: true }, pathname),
    ) ?? routesMeta[0]
  );
}

function getAdminListPageType(pathname) {
  if (matchPath({ path: "/admin/doctorlist", end: true }, pathname)) {
    return "doctor";
  }
  if (matchPath({ path: "/admin/userlist", end: true }, pathname)) {
    return "user";
  }
  return null;
}

function findAdminSearchInput() {
  return document.querySelector(
    'input[placeholder="Search doctors..."], input[placeholder="Search users..."]',
  );
}

function buildAdminListTitle(type, searchValue) {
  const label = type === "doctor" ? "Doctor List" : "User List";
  if (!searchValue) {
    return `${label} | BookMyDoctor`;
  }
  return `${label} — search: ${searchValue} | BookMyDoctor`;
}

function attachAdminListSeoListeners(pathname) {
  const type = getAdminListPageType(pathname);
  if (!type) {
    return () => {};
  }

  const updateTitleFromSearch = (value) => {
    document.title = buildAdminListTitle(type, value?.trim());
  };

  const onClick = (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.textContent.trim().toLowerCase() !== "view") return;

    const row = button.closest("tr");
    const nameElement = row?.querySelector("span.font-medium");
    const name = nameElement?.textContent?.trim();

    if (name) {
      const entity = type === "doctor" ? "Doctor" : "User";
      document.title = `${name} | ${entity} | BookMyDoctor`;
    }
  };

  const onInput = (event) => {
    updateTitleFromSearch(event.target.value);
  };

  document.addEventListener("click", onClick);

  const input = findAdminSearchInput();
  if (input) {
    input.addEventListener("input", onInput);
    updateTitleFromSearch(input.value);
  }

  const observer = new MutationObserver(() => {
    const observedInput = findAdminSearchInput();
    if (observedInput) {
      observedInput.addEventListener("input", onInput);
      updateTitleFromSearch(observedInput.value);
      observer.disconnect();
    }
  });

  if (!input) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  return () => {
    document.removeEventListener("click", onClick);
    if (input) {
      input.removeEventListener("input", onInput);
    }
    observer.disconnect();
  };
}

function findDoctorsPageHeading() {
  const headings = Array.from(document.querySelectorAll("h2"));
  return headings
    .map((heading) => heading.textContent?.trim())
    .find((text) => text && text.toLowerCase().includes("doctors"));
}

function attachDoctorsSeoListeners(pathname) {
  if (!matchPath({ path: "/doctors", end: true }, pathname)) {
    return () => {};
  }

  const updateFromDoctorsHeading = () => {
    const heading = findDoctorsPageHeading();
    const title = heading
      ? `${heading} | BookMyDoctor`
      : "Find Doctors Near You | BookMyDoctor";

    document.title = title;
    updateMetaTag(
      "name",
      "description",
      heading
        ? `${heading} — search and filter doctors on BookMyDoctor.`
        : "Browse doctors by specialty, availability, and ratings on BookMyDoctor.",
    );
    updateMetaTag(
      "name",
      "keywords",
      heading
        ? `${heading.replace(/\s+/g, ", ")}, doctor search, book doctor appointment`
        : "doctor search, find doctors, book appointment, healthcare professionals",
    );
  };

  const onInput = (event) => {
    if (event.target.matches("input[type='text'], input[type='search']")) {
      updateFromDoctorsHeading();
    }
  };

  const onChange = (event) => {
    if (
      event.target.matches(
        "select, input[type='checkbox'], input[type='radio']",
      ) ||
      event.target.closest("button")
    ) {
      updateFromDoctorsHeading();
    }
  };

  document.addEventListener("input", onInput, true);
  document.addEventListener("change", onChange, true);
  document.addEventListener("click", onChange, true);

  const headingElement = Array.from(document.querySelectorAll("h2")).find(
    (el) => el.textContent.toLowerCase().includes("doctors"),
  );

  const observer = new MutationObserver(updateFromDoctorsHeading);
  if (headingElement) {
    observer.observe(headingElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  updateFromDoctorsHeading();

  return () => {
    document.removeEventListener("input", onInput, true);
    document.removeEventListener("change", onChange, true);
    document.removeEventListener("click", onChange, true);
    observer.disconnect();
  };
}

function findProfileDisplayName() {
  const usernameInput = document.querySelector("input[name='username']");
  if (usernameInput?.value?.trim()) {
    return usernameInput.value.trim();
  }

  const headings = Array.from(document.querySelectorAll("h2"));
  return headings
    .map((heading) => heading.textContent?.trim())
    .find(
      (text) =>
        text &&
        ![
          "Profile",
          "Doctor Profile",
          "Appointment History",
          "Doctor Appointments",
          "Admin Dashboard",
        ].includes(text),
    );
}

function attachProfileSeoListeners(pathname) {
  const isUserProfile = matchPath({ path: "/profile", end: true }, pathname);
  const isDoctorProfile = matchPath(
    { path: "/doctor/profile", end: true },
    pathname,
  );
  if (!isUserProfile && !isDoctorProfile) {
    return () => {};
  }

  const pageLabel = isDoctorProfile ? "Doctor Profile" : "Profile";

  const updateFromProfile = () => {
    const name = findProfileDisplayName();
    const title = name
      ? `${name} | ${pageLabel} | BookMyDoctor`
      : `${pageLabel} | BookMyDoctor`;

    document.title = title;
    updateMetaTag(
      "name",
      "description",
      name
        ? `Manage ${isDoctorProfile ? "doctor" : "user"} profile settings for ${name} on BookMyDoctor.`
        : `Manage your ${isDoctorProfile ? "doctor" : "user"} profile on BookMyDoctor.`,
    );
    updateMetaTag(
      "name",
      "keywords",
      `${name || pageLabel}, ${isDoctorProfile ? "doctor profile" : "user profile"}, BookMyDoctor`,
    );
  };

  const onInput = (event) => {
    if (event.target.matches("input[name='username']")) {
      updateFromProfile();
    }
  };

  document.addEventListener("input", onInput, true);

  const observer = new MutationObserver(updateFromProfile);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  updateFromProfile();

  return () => {
    document.removeEventListener("input", onInput, true);
    observer.disconnect();
  };
}

function updateMetaTag(attribute, key, value) {
  if (!value) return;

  const selector = `${attribute}="${key}"`;
  let element = document.head.querySelector(`meta[${selector}]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
}

function updateLinkTag(rel, href) {
  if (!href) return;

  let link = document.head.querySelector(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

export default function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const routeMeta = findMeta(location.pathname);
    const canonicalUrl = `${baseUrl}${location.pathname}`;
    const stateMeta = location.state?.seoMeta || location.state?.meta || null;
    const dynamicRoute = dynamicRoutes.find((route) =>
      matchPath({ path: route.path, end: true }, location.pathname),
    );
    const params = dynamicRoute
      ? matchPath({ path: dynamicRoute.path, end: true }, location.pathname)
          ?.params
      : null;

    const applyMeta = (dynamicMeta = null) => {
      const meta = { ...routeMeta, ...stateMeta, ...dynamicMeta };

      if (meta.title) {
        document.title = meta.title;
      }

      updateMetaTag("name", "description", meta.description);
      updateMetaTag("name", "keywords", meta.keywords);
      updateMetaTag("property", "og:title", meta.title);
      updateMetaTag("property", "og:description", meta.description);
      updateMetaTag("property", "og:type", "website");
      updateMetaTag("property", "og:url", canonicalUrl);
      updateMetaTag(
        "property",
        "og:image",
        meta.ogImage ?? `${baseUrl}/og-image.jpg`,
      );
      updateMetaTag("name", "twitter:card", "summary_large_image");
      updateMetaTag("name", "twitter:title", meta.title);
      updateMetaTag("name", "twitter:description", meta.description);
      updateMetaTag(
        "name",
        "twitter:image",
        meta.twitterImage ?? `${baseUrl}/og-image.jpg`,
      );
      updateLinkTag("canonical", canonicalUrl);
    };

    const disconnectAdminSeo = attachAdminListSeoListeners(location.pathname);
    const disconnectDoctorSearchSeo = attachDoctorsSeoListeners(
      location.pathname,
    );
    const disconnectProfileSeo = attachProfileSeoListeners(location.pathname);

    const cleanAll = () => {
      disconnectAdminSeo();
      disconnectDoctorSearchSeo();
      disconnectProfileSeo();
    };

    if (dynamicRoute) {
      let active = true;

      dynamicRoute.getMeta(params).then((dynamicMeta) => {
        if (!active) return;
        applyMeta(dynamicMeta);
      });

      return () => {
        active = false;
        cleanAll();
      };
    }

    applyMeta();
    return cleanAll;
  }, [location]);

  return null;
}
