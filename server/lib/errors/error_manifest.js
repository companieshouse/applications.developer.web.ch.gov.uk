const ErrorManifest = {
  generic: {
    serverError: {
      summary: 'Internal server error. Please try again'
    }
  },
  validation: {
    default: {
      summary: 'Your request contains validation errors',
      inline: 'Your request contains validation errors'
    },
    applicationName: {
      blank: {
        summary: 'Enter your application name',
        inline: 'Enter your application name'
      },
      invalid: {
        summary: 'Name must only include letters a-z, A-Z, hyphens, spaces, apostrophes and full stops',
        inline: 'Name must only include letters a-z, A-Z, hyphens, spaces, apostrophes and full stops'
      }
    },
    keyName: {
      blank: {
        summary: 'Enter your key name',
        inline: 'Enter your key name'
      },
      invalid: {
        summary: 'Name must only include letters a-z, A-Z, hyphens, spaces, apostrophes and full stops',
        inline: 'Name must only include letters a-z, A-Z, hyphens, spaces, apostrophes and full stops'
      }
    },
    description: {
      blank: {
        summary: 'Enter a description',
        inline: 'Enter a description'
      },
      invalid: {
        summary: 'Description must only include letters a-z, A-Z, hyphens, spaces and apostrophes',
        inline: 'Description must only include letters a-z, A-Z, hyphens, spaces and apostrophes'
      }
    },
    environment: {
      blank: {
        summary: 'Select an environment for your application',
        inline: 'Select an environment for your application'
      }
    },
    type: {
      blank: {
        summary: 'Select the type of API client key you want to add',
        inline: 'Select the type of API client key you want to add'
      }
    },
    terms: {
      invalid: {
        summary: 'The Terms and Conditions URL format is invalid. The format should consist of \'http://’ followed by text separated by a decimal point. For example,  http://example.com ',
        inline: 'The Terms and Conditions URL format is invalid. The format should consist of \'http://’ followed by text separated by a decimal point. For example,  http://example.com'
      }
    },
    privacyPolicy: {
      invalid: {
        summary: 'The Privacy Policy URL format is invalid. The format should consist of \'http://’ followed by text separated by a decimal point. For example, http://example.com',
        inline: 'The Privacy Policy URL format is invalid. The format should consist of \'http://’ followed by text separated by a decimal point. For example, http://example.com'
      }
    },
    restrictedIp: {
      invalid: {
        summary: 'The IP address format for one or more entries is invalid. The format should consist of 4 sets of numbers separated by decimal points. For example, 123.54.267.1',
        inline: 'The IP address format for one or more entries is invalid. The format should consist of 4 sets of numbers separated by decimal points. For example, 123.54.267.1'
      }
    },
    javaScriptDomain: {
      invalid: {
        summary: "The JavaScript domain address format for one or more entries is invalid. The format should consist of 'http://' or 'https://' followed by text separated by a decimal point. For example, http://test.com",
        inline: "The JavaScript domain address format for one or more entries is invalid. The format should consist of 'http://' or 'https://' followed by text separated by a decimal point. For example, http://test.com"
      }
    },
    redirectURIs: {
      invalid: {
        summary: 'The Redirect URIs format for one or more entries is invalid. The format should consist of ’http://’ followed by text separated by a decimal point. For example, http://example.com',
        inline: 'The Redirect URIs format for one or more entries is invalid. The format should consist of ’http://’ followed by text separated by a decimal point. For example, http://example.com'
      }
    }
  }
};

module.exports = ErrorManifest;
