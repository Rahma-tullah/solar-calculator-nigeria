const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const emailService = {
  // Send calculation results via email
  sendCalculationResults: async (
    recipientEmail,
    recipientName,
    calculation
  ) => {
    try {
      // Format the email content
      const emailContent = `
        <h2>Your Solar Calculator Results</h2>
        
        <h3>Location Information</h3>
        <p><strong>State:</strong> ${calculation.state}</p>
        <p><strong>City:</strong> ${calculation.city}</p>
        <p><strong>Sunlight Quality:</strong> ${
          calculation.sunlight_quality
        }</p>
        
        <h3>Your Current Energy Costs</h3>
        <p><strong>Monthly NEPA Bill:</strong> ₦${parseFloat(
          calculation.monthly_nepa_bill
        ).toLocaleString()}</p>
        <p><strong>Monthly Fuel Cost:</strong> ₦${parseFloat(
          calculation.monthly_fuel_cost
        ).toLocaleString()}</p>
        <p><strong>Total Monthly Cost:</strong> ₦${parseFloat(
          calculation.current_monthly_grid_fuel_cost
        ).toLocaleString()}</p>
        
        <h3>Recommended Solar System</h3>
        <p><strong>System Type:</strong> ${calculation.system_type}</p>
        <p><strong>System Size:</strong> ${
          calculation.recommended_system_size_kw
        } kW</p>
        <p><strong>Power Requirement:</strong> ${
          calculation.total_power_requirement_watts
        } Watts</p>
        <p><strong>Equipment List:</strong> ${calculation.equipment_list}</p>
        
        <h3>Cost Analysis</h3>
        <p><strong>Estimated Total Cost:</strong> ₦${parseFloat(
          calculation.estimated_total_cost
        ).toLocaleString()}</p>
        <p><strong>Budget Comparison:</strong> ${
          calculation.budget_comparison
        }</p>
        
        ${
          calculation.payment_preference === "installment"
            ? `
          <h3>Installment Plan</h3>
          <p><strong>Monthly Payment:</strong> ₦${parseFloat(
            calculation.monthly_installment_amount
          ).toLocaleString()}</p>
          <p><strong>Duration:</strong> ${
            calculation.installment_duration_months
          } months</p>
          <p><strong>Total Amount Paid:</strong> ₦${parseFloat(
            calculation.total_paid_for_solar
          ).toLocaleString()}</p>
          
          <h3>Comparison with Current Spending</h3>
          <p>Over ${calculation.installment_duration_months} months:</p>
          <p><strong>Solar System (with installments):</strong> ₦${parseFloat(
            calculation.total_paid_for_solar
          ).toLocaleString()}</p>
          <p><strong>Grid + Fuel (if you continue):</strong> ₦${parseFloat(
            calculation.total_grid_fuel_cost_over_same_period
          ).toLocaleString()}</p>
          <p><em>After ${
            calculation.installment_duration_months
          } months, your solar system is paid off and you pay ₦0/month. With grid+fuel, you continue paying ₦${parseFloat(
                calculation.current_monthly_grid_fuel_cost
              ).toLocaleString()}/month indefinitely.</em></p>
        `
            : ""
        }
        
        <hr>
        <p><small><strong>Disclaimer:</strong> Prices may vary according to market conditions. The estimated total cost does not include installer workmanship fees.</small></p>
        
        <p>Ready to go solar? <a href="http://localhost:5000/api/installers">Find installers in your area</a></p>
        
        <p>Best regards,<br>Solar Calculator Team</p>
      `;

      // Email options
      const mailOptions = {
        from: `"Solar Calculator" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: "Your Solar Calculator Results",
        html: emailContent,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);

      console.log("Email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Email sending error:", error);
      throw error;
    }
  },
};

module.exports = emailService;
