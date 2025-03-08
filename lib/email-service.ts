// Ce service est une simulation. Dans une application réelle, vous utiliseriez
// un service d'envoi d'email comme SendGrid, Mailgun, AWS SES, etc.

export interface EmailData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  // Simuler un délai d'envoi
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simuler une réussite (ou un échec aléatoire pour tester la gestion d'erreur)
  const success = Math.random() > 0.1 // 10% de chance d'échec

  if (!success) {
    throw new Error("Échec de l'envoi de l'email")
  }

  // Log pour le développement
  console.log("Email envoyé:", data)

  return true
}

