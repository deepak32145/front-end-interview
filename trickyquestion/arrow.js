  continue() {
    const docId: any[] = [];
    let files: File[] = [];
    this.gridDocList.forEach((data: any) => {
      docId.push(data?.refDataDesc);
    });
    const payload = {
      docIds: docId,
      sessionId: '123456789',
    };
    if (this.boardPdfData) {
      files.push(this.boardPdfData);
    }
    this.commonData.processAction(Constants.SPINNER, true);
    const cisToken = this.sharedService.getCisToken();
    const appSubmissionPayload = this.prepareAppSubmissionPayload();
    this.dataService.appSubmissionCall(appSubmissionPayload, cisToken).subscribe({
      next: (res: any) => {
        if (res) {
          this.dataService
            .disclosureAcknowledgment(files, JSON.stringify(payload), this.sharedService.getCisToken())
            .subscribe({
              next: (Response: any) => {
                this.commonData.processAction(Constants.SPINNER, false);
                console.log(Response);
                this.onContinue({ moveNext: true });
              },
              error: (err: any) => {
                this.commonData.processAction(Constants.SPINNER, false);
              },
            });
        }
      },
      error: (err: any) => {
        console.log('app submissions failed');
        console.log('err', err);
        this.commonData.processAction(Constants.SPINNER, false);
      },
    });
  }
  prepareAppSubmissionPayload() {
    let finalDataSubmission = this.sharedService.getAll();
    const appSubmissionPayload = {
      appStatusTxt: 'Application initiated',
      channelCat: 'online',
      failureReason: null,
      applicantNm: null,
      applicantEmail: null,
      bankerNumId: null,
      appSubmitUserId: null,
      borrowerDetail: {
        customerUniqueId: null,
        personOrganizationCd: null,
        ssnOrTinNum: this.ownerTin,
        legalBusinessNm: this.businessCustomerName,
        doingBusinessAsNm: null,
        birthDt: this.ownerDOb,
        firstNm: finalDataSubmission?.personalDetails?.firstName,
        lastNm: finalDataSubmission?.personalDetails?.lastName,
        businessTitleId: null,
        legalStructureTypeId: null,
        isNonProfitInd: null,
        naicsCd: finalDataSubmission?.additionalBusinessQuestion?.businessNaicsCode
          ? finalDataSubmission?.additionalBusinessQuestion?.businessNaicsCode
          : '',
        annualPersonalIncomeAmt: null,
        annualRevenueAmt: finalDataSubmission?.additionalBusinessQuestion?.annualRevenue
          ? finalDataSubmission?.additionalBusinessQuestion?.annualRevenue
          : '',
        annualProfitAmt: finalDataSubmission?.additionalBusinessQuestion?.annualProfit
          ? finalDataSubmission?.additionalBusinessQuestion?.annualProfit
          : '',
        emailId: finalDataSubmission?.postBusinessIdentify?.email,
        websiteAddressId: null,
        formationDt: null,
        establishmentStateCd: null,
        customerAddressList: [
          {
            customerAddressTypeId: 1,
            cityNm: finalDataSubmission?.postBusinessIdentify?.city,
            line1Txt: finalDataSubmission?.postBusinessIdentify?.addressLine1,
            zipCd: finalDataSubmission?.postBusinessIdentify?.zip,
            phoneNum: null,
            stateCd: finalDataSubmission?.postBusinessIdentify?.state,
          },
          {
            customerAddressTypeId: 2,
            cityNm: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.city
              : finalDataSubmission?.postBusinessIdentify?.mailingCity,
            line1Txt: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.addressLine1
              : finalDataSubmission?.postBusinessIdentify?.mailingAddressLine1,
            zipCd: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.zip
              : finalDataSubmission?.postBusinessIdentify?.mailingZip,
            phoneNum: null,
            stateCd: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.state
              : finalDataSubmission?.postBusinessIdentify?.mailingState,
          },
        ],
        kycDetailsLst: [
          {
            techCustomerInfoPromptId: null,
            responseTxt: null,
          },
        ],
      },
      ownerDetailsLst: [
        {
          relationshipTypeId: null,
          ownershipPct: 100,
          ownershipStatus: null,
          establishmentStateCd: null,
          ownerInfo: {
            customerUniqueId: null,
            personOrganizationCd: null,
            ssnOrTinNum: this.ownerTin,
            solePropSsnNum: null,
            legalBusinessNm: null,
            doingBusinessAsNm: null,
            birthDt: this.ownerDOb,
            firstNm: finalDataSubmission?.personalDetails?.firstName,
            lastNm: finalDataSubmission?.personalDetails?.lastName,
            businessTitleId: null,
            legalStructureTypeId: null,
            isNonProfitInd: null,
            naicsCd: null,
            annualPersonalIncomeAmt: finalDataSubmission?.personalAdditionalQuestions?.annualIncome,
            annualRevenueAmt: null,
            annualProfitAmt: null,
            emailId: finalDataSubmission?.personalDetails?.emailId,
            websiteAddressId: null,
            formationDt: null,
            establishmentStateCd: null,
            customerAddressList: [
              {
                customerAddressTypeId: 1,
                cityNm: finalDataSubmission?.personalDetails?.city,
                line1Txt: finalDataSubmission?.personalDetails?.addressLine1,
                zipCd: finalDataSubmission?.personalDetails?.zip,
                phoneNum: null,
                stateCd: finalDataSubmission?.personalDetails?.state,
              },
            ],
            nraQuestion: {
              isUsCitizen: null,
              isLawfulPermanentResident: null,
              uscisNumber: null,
              expirationDateUscis: null,
            },
            kycDetailsLst: [
              {
                techCustomerInfoPromptId: 1,
                responseTxt: '',
              },
            ],
          },
          ownerDemographicDetails: {
            genderTypeId: 1,
            genderFreeformTxt: null,
            ethnicityDetailsLst: [
              {
                ethnicityTypeId: 5,
                ethnicitySubtypeId: 3,
                ethnicityFreeformTxt: null,
              },
            ],
            raceDetailsLst: [
              {
                raceTypeId: 5,
                raceSubtypeId: 3,
                raceFreeformTxt: null,
              },
            ],
          },
          customerIdentityDetailsLst: [
            {
              identityTypeId: this.ownerIdType,
              identityNum: this.ownerId,
              issuedBy: finalDataSubmission?.personalId?.issuedState,
              issuedDt: this.ownerIdIssueDate,
              expirationDt: this.ownerIdExpiryDate,
            },
          ],
        },
      ],
      appProductList: [
        {
          productTypeCd: '2',
          productSubtypeCd: '168',
          loanPurposeTypeCd: '495',
          subChannelId: 3,
          useOfFunds: null,
          requestedTermMon: '',
          newIncreaseId: 1,
          autopayInd: false,
          rewardsEarnedId: 0,
          lenderMatchReferralInd: '',
          accountNumber: '',
          routingNumber: '',
          deductedAmtId: null,
          requestedAmt: '',
          referredById: '',
          bankName: '',
          bankAddressLine1: '',
          bankAddressLine2: '',
          wireRoutingNumber: '',
          city: '',
          state: '',
          zipCode: '',
          additionalCardDetailsDTOLst: [],
          ownerProductLst: [
            {
              ssn: this.ownerTin,
              guaranteePct: 100,
              relationshipTypeId: 2,
            },
          ],
        },
      ],
      appRequestJson: JSON.stringify(this.prepareAppRequestJson()),
      appReviewJson: JSON.stringify(this.prepareAppReviewJson()),
    };
    return appSubmissionPayload;
  }
  prepareAppRequestJson() {
    const finalDataSubmission = this.sharedService.getAll();
    const payloadAppRequest = {
      routingReason: '',
      applicationDataStr: {
        products: [
          {
            productTempId: 1,
            productType: '2',
            productSubType1: '168',
            subChannelId: 3,
            productSubType2: '495',
            productSubDescription: null,
            useOfFunds: null,
            amountRequested: null,
            newIncreaseInd: '1',
            isLenderMatchReferral: '',
            termInMonths: '',
            billingPreference: null,
            lmIdentifier: '',
            isExistingCustomer: null,
            otherComments: null,
            autopayRoutingNum: '',
            rewardsType: '',
            routingReason: null,
            businessNameOnCard: null,
            bankName: '',
            bankAddressLine1: '',
            bankAddressLine2: '',
            wireRoutingNumber: '',
            city: '',
            state: '',
            zipCode: '',
          },
        ],
        borrower: {
          taxIdOrSsn: this.ownerTin,
          mgs: null,
          legalName: this.businessCustomerName,
          firstName: finalDataSubmission?.personalDetails?.firstName,
          middleName: finalDataSubmission?.personalDetails?.middleName,
          lastName: finalDataSubmission?.personalDetails?.lastName,
          dateOfBirth: this.ownerDOb,
          nonProfitInd: null,
          phoneNumber: finalDataSubmission?.postBusinessIdentify?.phone,
          dbaName: finalDataSubmission?.postBusinessIdentify?.dbaName,
          email: finalDataSubmission?.postBusinessIdentify?.email,
          doingBusinessSinceYear: '',
          doingBusinessSinceMonth: '',
          stateOfIncorporation: finalDataSubmission?.additionalBusinessQuestion?.registrationState
            ? finalDataSubmission?.additionalBusinessQuestion?.registrationState
            : '',
          natureOfBusiness: '',
          noOfEmployees: finalDataSubmission?.additionalBusinessQuestion?.noOfEmployees
            ? finalDataSubmission?.additionalBusinessQuestion?.noOfEmployees
            : '',
          businessNaicsCode: finalDataSubmission?.additionalBusinessQuestion?.businessNaicsCode
            ? finalDataSubmission?.additionalBusinessQuestion?.businessNaicsCode
            : '',
          businessNaicsDesc1: '',
          businessNaicsDesc2: '',
          annualRevenue: finalDataSubmission?.additionalBusinessQuestion?.annualRevenue,
          netIncome: finalDataSubmission?.additionalBusinessQuestion?.annualProfit,
          personalIncome: finalDataSubmission?.personalAdditionalQuestions?.annualIncome,
          dateOfLastTaxReturn: '',
          netIncomeAsOfDate: '',
          title: '',
          legalStructure: '',
          nameOfSigner: '',
          physicalAddress: {
            leaseOwned: '3',
            addressLine1: finalDataSubmission?.postBusinessIdentify?.addressLine1,
            city: finalDataSubmission?.postBusinessIdentify?.city,
            state: finalDataSubmission?.postBusinessIdentify?.state,
            zip: finalDataSubmission?.postBusinessIdentify?.zip,
          },
          mailingAddress: {
            leaseOwned: '3',
            addressLine1: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.addressLine1
              : finalDataSubmission?.postBusinessIdentify?.mailingAddressLine1,
            city: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.city
              : finalDataSubmission?.postBusinessIdentify?.mailingCity,
            state: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.state
              : finalDataSubmission?.postBusinessIdentify?.mailingState,
            zip: finalDataSubmission?.postBusinessIdentify?.isMailingSame
              ? finalDataSubmission?.postBusinessIdentify?.zip
              : finalDataSubmission?.postBusinessIdentify?.mailingZip,
          },
          customerKyc: [
            {
              kycType: null,
              kycResponse: null,
            },
          ],
          website: null,
          additionalProfileInformation: [
            {
              customerInfoCategoryId: null,
              promptList: [
                {
                  commentTxt: '',
                  customerInfoPromptId: '',
                  checkInd: null,
                },
              ],
            },
          ],
          nraCustomerInd: null,
        },
        guarantors: [
          {
            cardRequired: null,
            affiliateType: '',
            relationshipType: null,
            taxIdOrSsn: this.ownerTin,
            firstName: finalDataSubmission?.personalDetails?.firstName,
            title: '',
            middleName: finalDataSubmission?.personalDetails?.middleName ? finalDataSubmission?.personalDetails?.middleName : '',
            lastName: finalDataSubmission?.personalDetails?.lastName,
            dateOfBirth: finalDataSubmission?.personalDetails?.dateOfBirth,
            phoneNumber: finalDataSubmission?.personalDetails?.phone,
            email: finalDataSubmission?.personalDetails?.emailId,
            personalIncome: finalDataSubmission?.personalAdditionalQuestions?.annualIncome,
            ownershipPercentage: 100,
            physicalAddress: {
              leaseOwned: '3',
              addressLine1: finalDataSubmission?.personalDetails?.addressLine1,
              city: finalDataSubmission?.personalDetails?.city,
              state: finalDataSubmission?.personalDetails?.state,
              zip: finalDataSubmission?.personalDetails?.zip,
            },
            nraQuestion: {
              isUsCitizen: null,
              isLawfulPermanentResident: null,
              uscisNumber: null,
              expirationDateUscis: null,
            },
            felony: false,
            mailingAddress: {
              leaseOwned: '3',
              addressLine1: finalDataSubmission?.personalDetails?.addressLine1,
              city: finalDataSubmission?.personalDetails?.city,
              state: finalDataSubmission?.personalDetails?.state,
              zip: finalDataSubmission?.personalDetails?.zip,
            },
            customerIdentificationDetails: [
              {
                identificationType: this.ownerIdType,
                identificationNumber: this.ownerId,
                stateOfIssue: finalDataSubmission?.personalId?.issuedState,
                issueDate: this.ownerIdIssueDate,
                expirationDate: this.ownerIdExpiryDate,
              },
            ],
            ownerProductsLits: [
              {
                productTempId: 1,
                guaranteePercentage: 100,
              },
            ],
            additionalProfileInformation: [
              {
                customerInfoCategoryId: '',
                promptList: [
                  {
                    commentTxt: '',
                    customerInfoPromptId: '',
                    checkInd: null,
                  },
                ],
              },
            ],
          },
        ],
        custDemographInfo: [],
        originatorId: '',
        branchNum: '',
        bankNum: '',
      },
      referenceNo: null,
      requestTime: new Date().toISOString(),
      originator: '',
      originatorKey: null,
      serviceType: 'CREATE_APPLN',
    };
    return payloadAppRequest;
  }
  prepareAppReviewJson() {
    const finalDataSubmission = this.sharedService.getAll();
    const payloadAppReview = {
      applicationDataStr: {
        products: null,
        borrower: {
          textrender: {},
          generalInformation: {
            businessNaicsCodeandDesc: {
              id: '',
              label: '',
              value: '',
            },
            empty: '',
            legalBusinessName: finalDataSubmission?.postBusinessIdentify?.legalName,
            dbaNameQuestion: finalDataSubmission?.postBusinessIdentify?.dbaName,
            taxIdTin: this.ownerTin,
          },
          businessInformation: {
            businessPhone: finalDataSubmission?.postBusinessIdentify?.phone,
            businessEmailAddress: finalDataSubmission?.postBusinessIdentify?.email,
            businessWebsiteAddress: finalDataSubmission?.additionalBusinessQuestion?.webAddress,
            dateOfIncorporation: finalDataSubmission?.additionalBusinessQuestion?.dateOfFormation,
            stateOfIncorporation: finalDataSubmission?.additionalBusinessQuestion?.registrationState,
            noOfEmployees: finalDataSubmission?.additionalBusinessQuestion?.noOfEmployees,
            annualProfit: finalDataSubmission?.additionalBusinessQuestion?.annualProfit,
            annualRevenue: finalDataSubmission?.additionalBusinessQuestion?.annualRevenue,
          },
          businessAddress: {
            addressLine1: finalDataSubmission?.postBusinessIdentify?.addressLine1,
            city: finalDataSubmission?.postBusinessIdentify?.city,
            state: finalDataSubmission?.postBusinessIdentify?.state,
            zipCode: finalDataSubmission?.postBusinessIdentify?.zip,
            zipCodeValidForState: true,
          },
          questionwithoutSection: {
            useAboveBusinessAddress: finalDataSubmission?.postBusinessIdentify?.isMailingSame,
          },
        },
        guarantors: {
          owners: [
            {
              NRAQuestion: {
                isNraForUs: null,
                felcony: null,
                isLawfulPermanentResident: null,
                USCISNumber: null,
                expirationDateUSCIS: null,
                isUsCitizen: null,
              },
              personalDetails: {
                firstName: finalDataSubmission?.personalDetails?.firstName,
                middleName: finalDataSubmission?.personalDetails?.middleName ? finalDataSubmission?.personalDetails?.middleName : '',
                lastName: finalDataSubmission?.personalDetails?.lastName,
                socialSecurityNumber: this.ownerTin,
                personalMobileNumber: finalDataSubmission?.personalDetails?.phone,
                emailId: finalDataSubmission?.personalDetails?.emailId,
                personalIncome: finalDataSubmission?.personalAdditionalQuestions?.annualIncome,
              },
              commonIDDetails: {
                idType: this.ownerIdType,
                dateofBirth: this.ownerDOb,
                idNumber: this.ownerId,
                issuedBy: finalDataSubmission?.personalId?.issuedState,
                issueDate: this.ownerIdIssueDate,
                expiryDate: this.ownerIdExpiryDate,
              },
              homeAddress: {
                addressLine1: finalDataSubmission?.personalDetails?.addressLine1,
                city: finalDataSubmission?.personalDetails?.city,
                state: finalDataSubmission?.personalDetails?.state, 
                zipCode: finalDataSubmission?.personalDetails?.zip,
                zipCodeValidForState: true,
              },
              additionalDetails: {
                businessRelationship: '',
                title: '',
                ownershipInTheBusiness: '',
              },
            },
          ],
        },
        product: [],
      },
    };
    return payloadAppReview;
  }
