const emailTemplate = (link) => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <p style="color: #333;">Please click on the link below to verify your email address</p>
        <a href="${link}" style="background-color: #333; color: #fff; padding: 10px 20px; text-decoration: none;">Verify Email</a>
    </div>
    `
}

export default emailTemplate;