import React from 'react';
import styled from 'styled-components';
import { FaCommentDots } from 'react-icons/fa';
import type { ChatMessage } from '../../api/chat/chatApi';

interface Props {
  chatContainerRef: React.RefObject<HTMLDivElement>;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  handleChatSubmit: (e: React.FormEvent) => void;
}

const ChatSection: React.FC<Props> = ({
  chatContainerRef,
  chatMessages,
  chatInput,
  setChatInput,
  handleChatSubmit,
}) => {
  return (
    <Container>
      <Messages ref={chatContainerRef}>
        {chatMessages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
      </Messages>
      <Form onSubmit={handleChatSubmit}>
        <FaCommentDots style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} />
        <Input
          type='text'
          placeholder='메시지 입력...'
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
      </Form>
    </Container>
  );
};

export default ChatSection;

const Container = styled.div`
  flex: 2 1 600px;
  display: flex;
  flex-direction: column;
  border: 2px solid #000;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: inset 0 1px 0 #cee3f8;
`;

const Messages = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  background-color: #ddd;
  border-radius: 6px 6px 0 0;
`;

interface ChatBubbleProps {
  msg: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ msg }) => {
  const isOwnerMsg = Number(msg.userId) === 1; // OWNER_ID와 동일하게 처리
  const isNotice = msg.message.startsWith('[공지]');
  return (
    <BubbleContainer isOwner={isOwnerMsg} isNotice={isNotice}>
      <BubbleText isNotice={isNotice}>
        {isNotice
          ? msg.message
          : `[${msg.side}] 유저${msg.userId}: ${msg.message}`}
      </BubbleText>
    </BubbleContainer>
  );
};

const BubbleContainer = styled.div<{ isOwner: boolean; isNotice: boolean }>`
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 16px;
  margin: 4px 0;
  background-color: ${(props) =>
    props.isNotice ? '#ffe6e6' : props.isOwner ? '#dcf8c6' : '#fff'};
  align-self: ${(props) => (props.isOwner ? 'flex-end' : 'flex-start')};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  word-break: break-word;
`;

const BubbleText = styled.p<{ isNotice: boolean }>`
  font-size: 0.9rem;
  color: ${(props) => (props.isNotice ? 'red' : '#000')};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  border-top: 1px solid #000;
  padding: 0.5rem;
  background-color: #fff;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 0.3rem;
  outline: none;
`;
