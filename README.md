# Smart Account and Voting

## Table of Contents

- [What is Smart Account and Voting?](#what-is-smart-account)
- [Getting Started](#getting-started)
- [Our Vision](#the-vision)
- [Overview](#overview)
- [Licensing](#licensing)

## What is Smart Account and Voting?

Today, Smart Account uses the Ethereum blockchain to represent an account using a smart contract, attributes can be added by the account owner and are stored in hash form. Attributes can be endorsed by any user, this is done by storing a corresponding endorsement hash against the attribute hash. Endorsements are revocable and are considered current if not revoked.

To verify underlying attribute and endorsement data, corresponding hashes must be computed, and their presence verified within the corresponding account contract.

Attributes and endorsements are formed of field sets, merkle-root hashes are used to allow sharing and verification of partial data (such as date of birth within a driving license).

Smart Account and Voting is a platform that uses Ethereum and solidity smart contracts as a framework for its core protocol. 

## Prerequisites
  * min [Node.js 6.9](https://nodejs.org)
  * min [Python 2.7](https://www.python.org/download/releases/2.7/)
  * Command Line Tools
   * **Mac OS X**: [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`) and `brew install libgcrypt`
   * **Ubuntu / Linux**: `sudo apt-get install build-essential python-software-properties libssl-dev`

## Getting Started

### Setting up the dev environment

```bash
# Get the latest snapshot
#https
git clone https://github.com/oguzhankarahan/hyp-smart-account-and-voting.git
#ssh
git clone git@github.com:oguzhankarahan/hyp-smart-account-and-voting.git

# Change directory
cd hyp-smart-account-and-voting/

# Install NPM dependencies
yarn

# Run tests
yarn test

```

## The Vision

The vision for Smart Account and Voting is to enable a universal platform for account representation and verification, enabling people, organisations, Dapps, to obtain, use and verify account information with minimal reliance on centrally provided systems or services.

Such an outcome offers considerable social and economic advantage; in developing economies the ability to obtain credible account offers value outright, whilst in developed economies the vision addresses higher-order efficiency and user experience imperatives by standardising the technical framework within which any account artefact can be represented, shared and verified.

Beyond traditional account data, a Smart Account is intended to serve as a container (wallet) for digital assets owned by an account, for contracts an account is party to, and as a controller to account linked Dapps. 

To offer global utility, Smart Account should:

* Operate over resilient, widely accessible decentralised infrastructure, reducing risks of failure, compromise or imposed cost associated with centrally provided platforms
* Provide a high degree of default user privacy and security
* Operate at very low cost

## Overview

### The Smart Account structure: Smart Contracts, Attributes and Endorsements

The Smart Account construct uses an attribute-endorsement model enabled by the use of smart contracts which provide rudimentary role based permissions. An account-owner can attest that an 'attribute' is a correct representation of a part of their account (by storing a corresponding hash value within their account), following which third parties are can be attest/voting to the validity of each attribute (by storing a corresponding hash value against the attribute within the account)

#### Smart Contracts

##### SmartAccount.sol

This is the Smart Account contract as used by the Smart Account instance.  It describes the core functionality required as part of a Smart Account contracts with encryption keys, attributes & endorsements. 

A Smart Account is an [Ethereum](https://www.ethereum.org/) Smart Contract address. The smart contract must be constructed using valid Smart Account bytecode. It provides access to account management commands and stores hash representations of account data.

The Smart Contract has a constructor that defines the owner and core elements of the account:

* Contract address - a 32byte hash of the address at which the contract is deployed.
* Encryption key - a changeable encryption (public) key that allows other actors to send data for encrypted receipt and decryption by this account. This can be changed at any point.
* Signing key - a changeable encryption (public) key that allows other actors to verify Endorsements signed by this account.
* Attribute mapping - A mapping that stores the Attributes (and associated Endorsements) related to the contract/account.
* It also implements a kill function so that an account can be retired (though the record of it's 'active' period is of course retained in the blockchain).

#### SmartAccountRegistry.sol

This contract holds a curated list of valid contracts have approved as valid implementations of Smart Account. These are curated by hashing the bytecode of a known good contract.  This should be maintained as a list on the Blockchain so that other contracts can perform (optional) real-time verification that a contract is present on this list, and therefore a valid smart account.  There may be multiple statuses on this registry (initially Pending / Accepted / Rejected) so that the contracts can be better maintained.

### Attributes

An Attribute is a specific instance of an attribute template which has been populated and (the corresponding hash) stored within a Smart Account.

If verification of attribute field subsets is required, for instance to use a digital driving license in order to prove age but not disclose address, the attribute hash should be the merkle root of the attribute field set (with appropriate salt or RND values applied at the leaf node level to prevent reverse engineering of leaf node hash values).

**The attribute hash corresponds to an attribute record stored off-chain, which consists of at least:**

* AttributeHash
* AttributeId (attribute template accounting)
* Attribute field set

Attribute creation/update/removal transactions can only be submitted by the account owner.

### Endorsements

An endorsement is a notarised record of attestation by a third party in relation to a specified attribute, stored with the attribute within the account contract. Our initial implementation uses a single endorsement template. The definition of what 'endorsement' means for a given attribute can also be varied within the underlying attribute definition to provide some flexibility.

Receivers/consumers of account data may (should) privately manage the Endorser identities they are prepared to trust. 

**The endorsement hash corresponds to an endorsement record stored off-chain, which consists of at least:**

  * Endorsement Hash
  * Endorsee Address (Smart Account)
  * Endorsed Attribute Hash
  * Endorsement Expiry Date
  * Endorser Address (Smart Account or Voting ID)
  * Endorser signature of endorsement

Whilst attributes can only be added by an account owner, endorsements must be added anonymously from previously unused ethereum public keys. This is to preserve privacy and prevent unwanted account identification of an endorsing party. This will also allow endorsements to be created 'off chain', and added in by the owner themselves, providing the signature of the endorsement can be verified against an on-chain Account. The unrestricted ability to add endorsements presents a risk of spam or unwanted endorsements, for which there are a number of potential solutions, and for which future protocol updates may be introduced.

### Value of the account / attribute / endorsement model

Given that an attribute has been endorsed by a trusted third party, the weight of that endorsement is what adds value to the attribute. An attribute without endorsement requires complete trust in the account. For the benefit of the ecosystem, each time a user chooses to trust such an attribute, they should endorse the fact that they trust it.

The challenge lies in providing the transparency of endorsement types, if not endorsement people. For example, if I simply endorse a driving licence for the purpose of accounting a person qualfies for entry into a nightclub, then that same endorsement should hold far less weight on whether a person is entititled to drive. To that end I should only endorse the attributes of the driving licence that I have relied upon for my judgement, and rarely the document as a whole.

### Attribute Templates

An Attribute Template can describe either a single field, or collection of fields representing a logical set of account data.

Attribute templates are created and stored within the Smart account application instance (see Admin Microservice below).

The model for templates should follow that of jsonschemaform - whereby the definition of the form is kept in the attribute.

Whilst bespoke attribute templates can be configured for any purpose (consider an attribute template as a data collection form which facilitates personal data notarisation), it is expected that common attributes (e.g. driving license) will be standardised and endorsable, and in time repositories of common templates will be curated and shared for common reference.

## Wider architecture

The distributed ledger and account smart contract form just one layer in the Smart Account ecosystem, outside of this layer, numerous applications support the various off-chain storage and processing tasks needed during interaction with the blockchain. 

## Licensing

This code is released under the Apache v2 open source licence.
