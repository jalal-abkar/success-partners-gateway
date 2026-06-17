// src/exams.js
// Simple exams scaffold: create an MCQ exam and grade it client-side. PDF generation placeholder (jsPDF recommended).

export function createExam({ title, questions }) {
  // questions: [{ id, text, choices: [{id, text}], answerId }]
  const exam = { id: 'exam_' + Date.now(), title, questions, createdAt: new Date().toISOString() };
  // store locally for prototype
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  exams.push(exam); localStorage.setItem('exams', JSON.stringify(exams));
  return exam.id;
}

export function gradeExam(examId, answersMap) {
  // answersMap: { questionId: choiceId }
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  const exam = exams.find(e => e.id === examId);
  if (!exam) throw new Error('Exam not found');
  let correct = 0; let total = exam.questions.length;
  exam.questions.forEach(q => { if (answersMap[q.id] && answersMap[q.id] === q.answerId) correct++; });
  const score = Math.round((correct / total) * 100);
  return { score, correct, total };
}

export function generateCertificatePDF(studentName, examTitle, score) {
  // Placeholder: use jsPDF or html2pdf to generate server/client-side PDF.
  // Example with jsPDF (not included here):
  // const doc = new jsPDF(); doc.text(`Certificate`, 20, 20); doc.text(`${studentName}`, 20, 40); doc.save(`${studentName}_certificate.pdf`);
  console.warn('generateCertificatePDF: Implement using jsPDF or html2pdf in production.');
}
