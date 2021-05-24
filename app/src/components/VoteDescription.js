import React, { useState } from 'react'
import PropTypes from 'prop-types'
import AutoLink from '../components/AutoLink'

// Render a description associated to a vote.
// Usually vote.data.metadata and vote.data.description.
const VoteDescription = React.memo(function VoteDescription({
  disabled,
  description,
  prefix,
  ...props
}) {
  // If there is no description, the component doesn’t render anything.
  if (!description) {
    return null
  }

  const [question, setQuestion] = useState('')
  const [url, setURL] = useState('')
  const [wallet, setWallet] = useState('')
  const [signature, setSignature] = useState('')

  let splitArray = description.split(";");
  setQuestion(splitArray[0]);
  setURL(splitArray[1]);
  setWallet(splitArray[2]);
  setSignature(splitArray[3]);

  return (
    <div
      {...props}
      css={`
        // overflow-wrap:anywhere and hyphens:auto are not supported yet by
        // the latest versions of Safari (as of June 2020), which
        // is why word-break:break-word has been added here.
        hyphens: auto;
        overflow-wrap: anywhere;
        word-break: break-word;
      `}
    >
      {prefix}
      {disabled ? (
        // <span>{description}</span>
        <div>
          <div>
            <strong>URL:</strong><span>{url}</span>
          </div>
          <div>
            <strong>Wallet:</strong><span>{wallet}</span>
          </div>
          <div>
            <strong>Signature:</strong><span>{signature}</span>
          </div>
          <div>
            <strong>Question:</strong><span>{question}</span>
          </div>
        </div>
      ) : (
        <div>
          <AutoLink>
            <strong>URL:</strong><span>{url}</span>
          </AutoLink>
          <AutoLink>
            <strong>Wallet:</strong><span>{wallet}</span>
          </AutoLink>
          <AutoLink>
            <strong>Signature:</strong><span>{signature}</span>
          </AutoLink>
          <AutoLink>
            <strong>Question:</strong><span>{question}</span>
          </AutoLink>
        </div>
      )}
    </div>
  )
})

VoteDescription.propTypes = {
  description: PropTypes.node,
  disabled: PropTypes.bool,
  prefix: PropTypes.node,
}

VoteDescription.defaultProps = {
  description: "",
}

export default VoteDescription
