import { PrismaClient } from '@prisma/client'

// FIX: Force the database URL into the environment. 
// This bypasses the constructor errors you were seeing.
process.env.DATABASE_URL = 'prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza180eDNRN21iSkRXSXdVRFVwTWp0ZTciLCJhcGlfa2V5IjoiMDFLQldIWkdYQlNIMTRZR1lBNFFXRDdNTkYiLCJ0ZW5hbnRfaWQiOiI1YzM0OTRmYjFhYzdkNGJiZDEwYzM3MDMzMDcxMTBhYmEyODg4ODI1ZTBkYjdkOTY4MjcxYjkxNWRlODA5NzVhIiwiaW50ZXJuYWxfc2VjcmV0IjoiY2RhMjE5ZDAtNTYyNi00OTZmLTgxYWYtMTdjM2FjYWI3ZTIxIn0.a5Ylt4RciJAIJKEaTnlebwXeIl1NUKiAYLqFLfWK30o'

const prisma = new PrismaClient()

const studentsData = [
  { registerNo: 'RA2511026010869', name: 'VARNIKA JAIN' },
  { registerNo: 'RA2511026010870', name: 'KONDA VEERAVENKATAGANESH' },
  { registerNo: 'RA2511026010871', name: 'Y HARSHITHA' },
  { registerNo: 'RA2511026010872', name: 'ESAKI KESAVAN V' },
  { registerNo: 'RA2511026010874', name: 'KAVI PRIYA M' },
  { registerNo: 'RA2511026010875', name: 'SAMRIDDHI SINGH' },
  { registerNo: 'RA2511026010876', name: 'SATVIK SAHU' },
  { registerNo: 'RA2511026010877', name: 'MOHAMMED UBAID UL NAFEY' },
  { registerNo: 'RA2511026010878', name: 'ADITYA SHUBHANKAR' },
  { registerNo: 'RA2511026010879', name: 'PARUL TEKADE' },
  { registerNo: 'RA2511026010880', name: 'SIDDHARTHA MAJUMDER' },
  { registerNo: 'RA2511026010881', name: 'KEVIN K SHIBU' },
  { registerNo: 'RA2511026010882', name: 'BOBBALA MANJUNATH REDDY' },
  { registerNo: 'RA2511026010883', name: 'AARYA JAIN' },
  { registerNo: 'RA2511026010884', name: 'HARSHITHA GUNTUR VENKATESWARLU' },
  { registerNo: 'RA2511026010885', name: 'L NAGA ABHIESH REDDY' },
  { registerNo: 'RA2511026010886', name: 'SHARMISTHA MOHAPATRA' },
  { registerNo: 'RA2511026010887', name: 'VENKATA SAI TEJEESH CH' },
  { registerNo: 'RA2511026010888', name: 'ARYA G A' },
  { registerNo: 'RA2511026010889', name: 'MIHIR SINHA' },
  { registerNo: 'RA2511026010890', name: 'PRANAV SINGH' },
  { registerNo: 'RA2511026010891', name: 'AMRITHA H' },
  { registerNo: 'RA2511026010892', name: 'A SAI SANZANA RREDDY' },
  { registerNo: 'RA2511026010893', name: 'ARTH PARETA' },
  { registerNo: 'RA2511026010894', name: 'ARPIT SINGH' },
  { registerNo: 'RA2511026010895', name: 'SHARON NILUPHA J' },
  { registerNo: 'RA2511026010896', name: 'ADUTIYA AGARWAL' },
  { registerNo: 'RA2511026010897', name: 'TEG SINGH GILL' },
  { registerNo: 'RA2511026010898', name: 'DHANUSH KUMAR S' },
  { registerNo: 'RA2511026010899', name: 'ADIBOINA DIGVIJAY' },
  { registerNo: 'RA2511026010900', name: 'DARSHIL JOSHI' },
  { registerNo: 'RA2511026010901', name: 'RACHIT JHA' },
  { registerNo: 'RA2511026010902', name: 'TAYDEN J' },
  { registerNo: 'RA2511026010903', name: 'MANNI HARSHINI CHOWDARY' },
  { registerNo: 'RA2511026010904', name: 'EISHIT JAIN' },
  { registerNo: 'RA2511026010905', name: 'MALIK MOHMMAD AUSAIB' },
  { registerNo: 'RA2511026010906', name: 'VOOKA SAI SIDDHARTH' },
  { registerNo: 'RA2511026010907', name: 'SHUBHANG DARSHAN' },
  { registerNo: 'RA2511026010908', name: 'SRI VAISHNAVIMEENA LA' },
  { registerNo: 'RA2511026010909', name: 'ANURAG PRASAD' },
  { registerNo: 'RA2511026010910', name: 'DONALD ABISHAI FERNANDO A' },
  { registerNo: 'RA2511026010911', name: 'HARIHARAN R' },
  { registerNo: 'RA2511026010912', name: 'PANDIPRAJIN S' },
  { registerNo: 'RA2511026010913', name: 'VISHNUVARDHAN RAMPRABU' },
  { registerNo: 'RA2511026010914', name: 'S AHAMED THALHA' },
  { registerNo: 'RA2511026010915', name: 'PARTH SINGH' },
  { registerNo: 'RA2511026010916', name: 'THIRISHA M' },
  { registerNo: 'RA2511026010917', name: 'MOHITHA SK' },
  { registerNo: 'RA2511026010918', name: 'SHAGUN' },
  { registerNo: 'RA2511026010919', name: 'AARON LOW' },
  { registerNo: 'RA2511026010920', name: 'KRISH SHARMA' },
  { registerNo: 'RA2511026010921', name: 'M SARVESH' },
  { registerNo: 'RA2511026010922', name: 'KUNSH KAKKAR' },
  { registerNo: 'RA2511026010923', name: 'PASALA GHANA CHARAN NARAYANA' },
  { registerNo: 'RA2511026010924', name: 'DIKSHA GULATI' },
  { registerNo: 'RA2511026010925', name: 'NOORUL ARFIN S' },
  { registerNo: 'RA2511026010926', name: 'ARNAV SINGH' },
  { registerNo: 'RA2511026010927', name: 'M MANUSREE' },
  { registerNo: 'RA2511026010928', name: 'SHAURYA SINGLA' },
  { registerNo: 'RA2511026010929', name: 'SUBHANKAR BISWAL' },
  { registerNo: 'RA2511026010930', name: 'DHANUNJAY DAS' },
  { registerNo: 'RA2511026010931', name: 'AANJNAY SAROHA' },
  { registerNo: 'RA2511026010932', name: 'NAGULESH R' },
  { registerNo: 'RA2511026010933', name: 'EPURI NITHIN' },
  { registerNo: 'RA2511026010934', name: 'SAYED AYESHA' },
  { registerNo: 'RA2511026010935', name: 'K ARAVIND' },
  { registerNo: 'RA2511026010936', name: 'DEVA PRIYA DARSINI PINNAMANENI' },
  { registerNo: 'RA2511026010937', name: 'KATEPALLI RAJESH' },
  { registerNo: 'RA2511026010938', name: 'GOLI THANMAYE' },
  { registerNo: 'RA2511026010939', name: 'YALLAPU VIHAS' },
  { registerNo: 'RA2511026010940', name: 'AQIB SHAFEEQUE' },
  { registerNo: 'RA2511026010603', name: 'YESHVANTHKRITHIK' }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const s of studentsData) {
    const student = await prisma.student.upsert({
      where: { registerNo: s.registerNo },
      update: {},
      create: {
        registerNo: s.registerNo,
        name: s.name,
      },
    })
    console.log(`Created student: ${student.name}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })