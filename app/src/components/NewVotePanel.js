import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Field,
  GU,
  Info,
  SidePanel,
  TextInput,
  useSidePanelFocusOnReady,
} from '@aragon/ui'

const NewVotePanel = React.memo(function NewVotePanel({
  panelState,
  onCreateVote,
}) {
  return (
    <SidePanel
      title="New Vote"
      opened={panelState.visible}
      onClose={panelState.requestClose}
    >
      <NewVotePanelContent onCreateVote={onCreateVote} />
    </SidePanel>
  )
})

function NewVotePanelContent({ onCreateVote }) {
  const [question, setQuestion] = useState('')
  const [url, setURL] = useState('')
  const [wallet, setWallet] = useState('')
  const [signature, setSignature] = useState('')

  const inputRef = useSidePanelFocusOnReady()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      onCreateVote(question.trim().replaceAll("\n", "") + "\n" + url.trim().replaceAll("\n", "") + "\n" + wallet.trim().replaceAll("\n", "") + "\n" + signature.trim().replaceAll("\n", ""))
    },
    [onCreateVote, question.replaceAll("\n", "") + "\n" + url.replaceAll("\n", "") + "\n" + wallet.replaceAll("\n", "") + "\n" + signature.replaceAll("\n", "")]
  )

  const handleQuestionChange = useCallback(event => {
    setQuestion(event.target.value)
  }, [])

  const handleUrlChange = useCallback(event => {
    setURL(event.target.value)
  }, [])
  const handleWalletChange = useCallback(event => {
    setWallet(event.target.value)
  }, [])
  const handleSignatureChange = useCallback(event => {
    setSignature(event.target.value)
  }, [])

  return (
    <div>
      <form
        css={`
          margin-top: ${3 * GU}px;
        `}
        onSubmit={handleSubmit}
      >
        <Field label="Question">
          <TextInput
            ref={inputRef}
            value={question}
            onChange={handleQuestionChange}
            required
            wide
          />
        </Field>
        <Field label="URL">
          <TextInput
            ref={inputRef}
            value={url}
            onChange={handleUrlChange}
            required
            wide
          />
        </Field>
        <Field label="Wallet Address">
          <TextInput
            ref={inputRef}
            value={wallet}
            onChange={handleWalletChange}
            required
            wide
          />
        </Field>
        <Field label="Signature">
          <TextInput
            ref={inputRef}
            value={signature}
            onChange={handleSignatureChange}
            required
            wide
          />
        </Field>
        <div
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          <Info>
            These votes are informative and used for signaling. They don’t have
            any direct repercussions on the organization.
          </Info>
        </div>
        <Button disabled={!question && !url && !wallet && !signature} mode="strong" type="submit" wide>
          Create new vote
        </Button>
      </form>
    </div>
  )
}

NewVotePanelContent.propTypes = {
  onCreateVote: PropTypes.func,
}

NewVotePanelContent.defaultProps = {
  onCreateVote: () => {},
}

export default NewVotePanel
