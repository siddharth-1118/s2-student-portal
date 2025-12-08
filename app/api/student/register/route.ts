import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Make sure this path is correct

const validStudents = [
  { roll: "RA2511026010868", name: "GURRAM VINAY JASWANTH" }, // Added missing first student
  { roll: "RA2511026010869", name: "VARNIKA JAIN" },
  { roll: "RA2511026010870", name: "KONDA VEERAVENKATAGANESH" },
  { roll: "RA2511026010871", name: "Y HARSHITHA" },
  { roll: "RA2511026010872", name: "ESAKI KESAVAN V" },
  { roll: "RA2511026010874", name: "KAVI PRIYA M" },
  { roll: "RA2511026010875", name: "SAMRIDDHI SINGH" },
  { roll: "RA2511026010876", name: "SATVIK SAHU" },
  { roll: "RA2511026010877", name: "MOHAMMED UBAID UL NAFEY" },
  { roll: "RA2511026010878", name: "ADITYA SHUBHANKAR" },
  { roll: "RA2511026010879", name: "PARUL TEKADE" },
  { roll: "RA2511026010880", name: "SIDDHARTHA MAJUMDER" },
  { roll: "RA2511026010881", name: "KEVIN K SHIBU" },
  { roll: "RA2511026010882", name: "BOBBALA MANJUNATH REDDY" },
  { roll: "RA2511026010883", name: "AARYA JAIN" },
  { roll: "RA2511026010884", name: "HARSHITHA GUNTUR VENKATESWARLU" },
  { roll: "RA2511026010885", name: "L NAGA ABHIESH REDDY" },
  { roll: "RA2511026010886", name: "SHARMISTHA MOHAPATRA" },
  { roll: "RA2511026010887", name: "VENKATA SAI TEJEESH CH" },
  { roll: "RA2511026010888", name: "ARYA G A" },
  { roll: "RA2511026010889", name: "MIHIR SINHA" },
  { roll: "RA2511026010890", name: "PRANAV SINGH" },
  { roll: "RA2511026010891", name: "AMRITHA H" },
  { roll: "RA2511026010892", name: "A SAI SANZANA RREDDY" },
  { roll: "RA2511026010893", name: "ARTH PARETA" },
  { roll: "RA2511026010894", name: "ARPIT SINGH" },
  { roll: "RA2511026010895", name: "SHARON NILUPHA J" },
  { roll: "RA2511026010896", name: "ADUTIYA AGARWAL" },
  { roll: "RA2511026010897", name: "TEG SINGH GILL" },
  { roll: "RA2511026010898", name: "DHANUSH KUMAR S" },
  { roll: "RA2511026010899", name: "ADIBOINA DIGVIJAY" },
  { roll: "RA2511026010900", name: "DARSHIL JOSHI" },
  { roll: "RA2511026010901", name: "RACHIT JHA" },
  { roll: "RA2511026010902", name: "TAYDEN J" },
  { roll: "RA2511026010903", name: "MANNI HARSHINI CHOWDARY" },
  { roll: "RA2511026010904", name: "EISHIT JAIN" },
  { roll: "RA2511026010905", name: "MALIK MOHMMAD AUSAIB" },
  { roll: "RA2511026010906", name: "VOOKA SAI SIDDHARTH" },
  { roll: "RA2511026010907", name: "SHUBHANG DARSHAN" },
  { roll: "RA2511026010908", name: "SRI VAISHNAVIMEENA LA" },
  { roll: "RA2511026010909", name: "ANURAG PRASAD" },
  { roll: "RA2511026010910", name: "DONALD ABISHAI FERNANDO A" },
  { roll: "RA2511026010911", name: "HARIHARAN R" },
  { roll: "RA2511026010912", name: "PANDIPRAJIN S" },
  { roll: "RA2511026010913", name: "VISHNUVARDHAN RAMPRABU" },
  { roll: "RA2511026010914", name: "S AHAMED THALHA" },
  { roll: "RA2511026010915", name: "PARTH SINGH" },
  { roll: "RA2511026010916", name: "THIRISHA M" },
  { roll: "RA2511026010917", name: "MOHITHA SK" },
  { roll: "RA2511026010918", name: "SHAGUN" },
  { roll: "RA2511026010919", name: "AARON LOW" },
  { roll: "RA2511026010920", name: "KRISH SHARMA" },
  { roll: "RA2511026010921", name: "M SARVESH" },
  { roll: "RA2511026010922", name: "KUNSH KAKKAR" },
  { roll: "RA2511026010923", name: "PASALA GHANA CHARAN NARAYANA" },
  { roll: "RA2511026010924", name: "DIKSHA GULATI" },
  { roll: "RA2511026010925", name: "NOORUL ARFIN S" },
  { roll: "RA2511026010926", name: "ARNAV SINGH" },
  { roll: "RA2511026010927", name: "M MANUSREE" },
  { roll: "RA2511026010928", name: "SHAURYA SINGLA" },
  { roll: "RA2511026010929", name: "SUBHANKAR BISWAL" },
  { roll: "RA2511026010930", name: "DHANUNJAY DAS" },
  { roll: "RA2511026010931", name: "AANJNAY SAROHA" },
  { roll: "RA2511026010932", name: "NAGULESH R" },
  { roll: "RA2511026010933", name: "EPURI NITHIN" },
  { roll: "RA2511026010934", name: "SAYED AYESHA" },
  { roll: "RA2511026010935", name: "K ARAVIND" },
  { roll: "RA2511026010936", name: "DEVA PRIYA DARSINI PINNAMANENI" },
  { roll: "RA2511026010937", name: "KATEPALLI RAJESH" },
  { roll: "RA2511026010938", name: "GOLI THANMAYE" },
  { roll: "RA2511026010939", name: "YALLAPU VIHAS" },
  { roll: "RA2511026010940", name: "AQIB SHAFEEQUE" },
  { roll: "RA2511026010603", name: "YESHVANTHKRITHIK" },
  // Adding the missing student
  { roll: "SV3824", name: "Student with email sv3824@srmist.edu.in" }
];

export async function POST(req: NextRequest) {
  const { email, roll, password } = await req.json();

  // 1. Check if the provided roll number is in our allowed list
  const validStudent = validStudents.find(s => s.roll === roll);
  
  if (!validStudent) {
    return NextResponse.json({ ok: false, error: "Register number not found in class list" });
  }

  // 2. Look up the student in the database using the correct field 'registerNo'
  // Your Schema calls it 'registerNo', so we must use that instead of 'roll'
  const existing = await prisma.student.findUnique({ 
    where: { registerNo: roll } // Map 'roll' from input to 'registerNo' in DB
  });
  
  // 3. Validation: If email is already taken by someone else (optional check, depends on your logic)
  if (existing && existing.email && existing.email !== email) {
    return NextResponse.json({ ok: false, error: "Register number already linked to another account" });
  }

  // 4. Prepare data for student creation/update
  const studentData: any = {
    registerNo: roll, // Use 'registerNo' here!
    name: validStudent.name
    // Only set email if it's not already set or if we're explicitly setting it
  };

  // Preserve existing email if it exists
  if (existing?.email) {
    studentData.email = existing.email;
  } else if (email) {
    // Only set email if it's not already set and we're providing one
    studentData.email = email;
  }

  // Add password if provided (for email/password authentication)
  if (password) {
    // In production, hash the password with bcrypt
    // For now, we'll store it directly (NOT recommended for production)
    studentData.password = password;
  }

  // 5. Update or Create the student
  if (existing) {
    await prisma.student.update({
      where: { id: existing.id },
      data: studentData,
    });
  } else {
    // When creating, we must use the correct schema field names
    await prisma.student.create({
      data: studentData,
    });
  }

  return NextResponse.json({ ok: true });
}