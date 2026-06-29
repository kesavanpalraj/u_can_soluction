import { Resend } from "resend";
import Admin from "../models/Admin.js";

let resendInstance = null;
const getResend = () => {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

function buildHtml(type, data) {
  const fields = [];

  if (data.name) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Name</td><td style="padding:6px 12px;border:1px solid #ddd">${data.name}</td></tr>`);
  if (data.email) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Email</td><td style="padding:6px 12px;border:1px solid #ddd">${data.email}</td></tr>`);
  if (data.phone) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Phone</td><td style="padding:6px 12px;border:1px solid #ddd">${data.phone}</td></tr>`);
  if (data.address) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Address</td><td style="padding:6px 12px;border:1px solid #ddd">${data.address}</td></tr>`);

  if (type === "project" || type === "course") {
    if (data.degree) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Degree</td><td style="padding:6px 12px;border:1px solid #ddd">${data.degree}</td></tr>`);
    if (data.projectTitle) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Project</td><td style="padding:6px 12px;border:1px solid #ddd">${data.projectTitle}</td></tr>`);
    if (data.courseTitle) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Course</td><td style="padding:6px 12px;border:1px solid #ddd">${data.courseTitle}</td></tr>`);
  }

  if (type === "course" && data.mode) {
    fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Mode</td><td style="padding:6px 12px;border:1px solid #ddd">${data.mode}</td></tr>`);
  }

  if (type === "internship") {
    if (data.gender) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Gender</td><td style="padding:6px 12px;border:1px solid #ddd">${data.gender}</td></tr>`);
    if (data.degree) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Degree</td><td style="padding:6px 12px;border:1px solid #ddd">${data.degree}</td></tr>`);
    if (data.yearOfStudy) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Year of Study</td><td style="padding:6px 12px;border:1px solid #ddd">${data.yearOfStudy}</td></tr>`);
    if (data.college) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">College</td><td style="padding:6px 12px;border:1px solid #ddd">${data.college}</td></tr>`);
    if (data.collegeLocation) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">College Location</td><td style="padding:6px 12px;border:1px solid #ddd">${data.collegeLocation}</td></tr>`);
    if (data.domain) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Domain</td><td style="padding:6px 12px;border:1px solid #ddd">${data.domain}</td></tr>`);
    if (data.duration) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Duration</td><td style="padding:6px 12px;border:1px solid #ddd">${data.duration}</td></tr>`);
    if (data.mode) fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Mode</td><td style="padding:6px 12px;border:1px solid #ddd">${data.mode}</td></tr>`);
  }

  if (data.message) {
    fields.push(`<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Message</td><td style="padding:6px 12px;border:1px solid #ddd">${data.message}</td></tr>`);
  }

  const typeLabel = type === "project" ? "Project Enquiry" : type === "course" ? "Course Enquiry" : "Internship Application";

  return `
    <h2>New ${typeLabel}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:Arial,sans-serif;font-size:14px">
      ${fields.join("")}
    </table>
    <p style="margin-top:20px;font-size:13px;color:#666">
      View in admin dashboard: <a href="${process.env.SITE_URL || "https://ucansolution.com"}/admin">Admin Dashboard</a>
    </p>
  `;
}

export async function sendAdminNotification({ type, data }) {
  try {
    const admin = await Admin.findOne();
    if (!admin || !admin.email || !admin.notificationsEnabled) return;

    const resend = getResend();
    if (!resend) return;

    const typeLabel = type === "project" ? "Project Enquiry" : type === "course" ? "Course Enquiry" : "Internship Application";

    await resend.emails.send({
      from: "U Can Solution <noreply@ucansolution.com>",
      to: admin.email,
      subject: `New ${typeLabel} from ${data.name || "Unknown"}`,
      html: buildHtml(type, data),
    });
  } catch {
    // Silently fail — never block the form submission
  }
}
