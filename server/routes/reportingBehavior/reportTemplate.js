const renderStringCalculationFirstCheck = (passedType) => {
    switch (passedType) {
        case 'Report Racism, Sexism Or Other Extremism':
            return `Report Type: Racism, Sexism Or Other Extremism \n\nReported via chat messaging (1v1 messaging) between two user's during dialog - investigate further by reviewing chat log(s) & take appropriate action. \n\nSeverity Scale: 10 (1-10 - 10 being highest priority.)`;
            break;
        case 'Report dangerous situation/user':
            return `Report Type: Dangerous situation/user \n\nReported via chat messaging (1v1 messaging) between two user's during dialog - investigate further by reviewing chat log(s) & take appropriate action. \n\nSeverity Scale: 8 (1-10 - 10 being highest priority.)`;
            break;
        case "Unmatch & report general behavior":
            return `Report Type: Investigate user's general behavior regarding the chat conversation/dialog. \n\nReported via chat messaging (1v1 messaging) between two user's during dialog - investigate further by reviewing chat log(s) & take appropriate action. \n\nSeverity Scale: 3 (1-10 - 10 being highest priority.)`;
            break;
        case "Report physical safety concerns":
            return `Report Type: Investigate user's general behavior regarding the chat conversation/dialog. \n\nReported via chat messaging (1v1 messaging) between two user's during dialog - investigate further by reviewing chat log(s) & take appropriate action. \n\nSeverity Scale: 3 (1-10 - 10 being highest priority.)`;
            break;
        case "Report bullying/harassment":
            return `Report Type: Bullying/Harassment or deminitive behavior \n\nReported via chat messaging (1v1 messaging) between two user's during dialog - investigate further by reviewing chat log(s) & take appropriate action. \n\nSeverity Scale: 6 (1-10 - 10 being highest priority.)`;
            break;
        default:
            break;
    }
};

const reportingTemplate = (passedType, otherUser, authedUser) => {
    return `<!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Simple Transactional Email</title>
        <style>
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
    
      table.body p,
    table.body ul,
    table.body ol,
    table.body td,
    table.body span,
    table.body a {
        font-size: 16px !important;
      }
    
      table.body .wrapper,
    table.body .article {
        padding: 10px !important;
      }
    
      table.body .content {
        padding: 0 !important;
      }
    
      table.body .container {
        padding: 0 !important;
        width: 100% !important;
      }
    
      table.body .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
    
      table.body .btn table {
        width: 100% !important;
      }
    
      table.body .btn a {
        width: 100% !important;
      }
    
      table.body .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }
    @media all {
      .ExternalClass {
        width: 100%;
      }
    
      .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
        line-height: 100%;
      }
    
      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
    
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
    
      .btn-primary table td:hover {
        background-color: #34495e !important;
      }
    
      .btn-primary a:hover {
        background-color: #34495e !important;
        border-color: #34495e !important;
      }
    }
    </style>
      </head>
      <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
        <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
          <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
            <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
              <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
                <!-- START CENTERED WHITE CONTAINER -->
                <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tr>
                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Reported User Credentials (Problem User): \n\n${otherUser.firstName} ${otherUser.lastName}/@${otherUser.username} (name, username)</p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Account Type Of Victim: ${authedUser.accountType}</p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Account Type Of Problem User: ${otherUser.accountType}</p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">${renderStringCalculationFirstCheck(passedType)}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                <!-- END MAIN CONTENT AREA -->
                </table>
                <!-- END CENTERED WHITE CONTAINER -->
              </div>
            </td>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>`;
}

module.exports = reportingTemplate;