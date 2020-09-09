let ErrorManifest = {
  generic: {
    serverError: {
      summary: "Internal server error. Please try again"
    }
  },
  validation: {
    default: {
      summary: "Your request contains validation errors",
      inline: "Your request contains validation errors"
    },
    name: {
      blank: {
        summary: "Enter a name",
        inline: "Enter a name"
      },
      invalid: {
        summary: "Name must only include letters a-z, A-Z, hyphens, spaces, apostrophes and full stops",
        inline: "Name must only include letters a-z, A-Z, hyphens, spaces, apostrophes and full stops"
      }
    },
    description: {
      blank: {
        summary: "Enter a description",
        inline: "Enter a description"
      },
      invalid: {
        summary: "Description must only include letters a-z, A-Z, hyphens, spaces and apostrophes",
        inline: "Description must only include letters a-z, A-Z, hyphens, spaces and apostrophes"
      }
    },
    environment: {
      blank: {
        summary: "Choose an environment",
        inline: "Choose an environment"
      }
    },
    type: {
      blank: {
        summary: "Choose a type",
        inline: "Choose a type"
      }
    },
    terms: {
      invalid: {
        summary: "Enter a valid terms and conditions url",
        inline: "Enter a valid terms and conditions url"
      }
    },
    privacyPolicy: {
      invalid: {
        summary: "Enter a valid privacy policy url",
        inline: "Enter a valid privacy policy url"
      }
    }
  }
};

module.exports = ErrorManifest;
