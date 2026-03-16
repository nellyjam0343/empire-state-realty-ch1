// Messages Component - Conversation view with client context
const { useState, useEffect, useRef } = React;

function MessagesView({ shop, barber }) {
  const [conversations, setConversations] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    db.getConversations(shop.id)
      .then(data => { setConversations(data); setLoading(false); })
      .catch(() => setLoading(false));

    // Subscribe to new messages
    const channel = db.subscribeToMessages(shop.id, (payload) => {
      // Refresh conversations on new message
      db.getConversations(shop.id).then(setConversations).catch(() => {});
    });
    return () => channel.unsubscribe();
  }, [shop]);

  const filtered = conversations.filter(c =>
    (c.client_name || c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.client_phone || c.phone || '').includes(search)
  );

  const selectedClient = conversations.find(c => (c.client_id || c.id) === selectedClientId);

  return (
    <div className="fade-in" style={{ height: 'calc(100vh - 96px)', display: 'flex', gap: 0 }}>
      {/* Conversation List */}
      <div style={{
        width: 320, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-card)', borderRadius: 'var(--radius) 0 0 var(--radius)',
        ...(selectedClientId ? {} : {})
      }}>
        <div style={{ padding: '20px 16px 12px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 12 }}>
            Messages
          </h2>
          <input
            className="input"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 13 }}
          />
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0 8px 8px' }}>
          {filtered.map(conv => {
            const clientId = conv.client_id || conv.id;
            const clientName = conv.client_name || conv.name;
            const clientPhone = conv.client_phone || conv.phone;
            const isSelected = clientId === selectedClientId;

            return (
              <button
                key={clientId}
                onClick={() => setSelectedClientId(clientId)}
                style={{
                  display: 'flex', gap: 12, width: '100%', padding: '12px',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--accent-subtle)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'background 0.15s'
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: utils.stringToColor(clientName),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: 'white'
                }}>
                  {utils.getInitials(clientName)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 14, fontWeight: 600, color: isSelected ? 'var(--accent)' : 'var(--text-primary)'
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {clientName}
                    </span>
                    {conv.last_message_at && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 8 }}>
                        {utils.relativeTime(conv.last_message_at)}
                      </span>
                    )}
                  </div>
                  {conv.last_message && (
                    <div style={{
                      fontSize: 12, color: 'var(--text-muted)', marginTop: 2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {conv.last_message}
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', fontSize: 13 }}>
              {search ? 'No matching conversations' : 'No conversations yet'}
            </div>
          )}
        </div>
      </div>

      {/* Chat View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', borderRadius: '0 var(--radius) var(--radius) 0' }}>
        {selectedClientId ? (
          <ChatThread
            shop={shop}
            barber={barber}
            clientId={selectedClientId}
            clientName={selectedClient?.client_name || selectedClient?.name || 'Client'}
          />
        ) : (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12, color: 'var(--text-muted)'
          }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Chat Thread
function ChatThread({ shop, barber, clientId, clientName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [clientData, setClientData] = useState(null);
  const messagesEndRef = useRef(null);

  // Load messages and client data
  useEffect(() => {
    if (!clientId || !shop) return;
    db.getMessages(shop.id, clientId).then(setMessages).catch(() => {});

    // Load client context
    supabaseClient.from('clients').select('*, appointments(*, services(name))')
      .eq('id', clientId)
      .single()
      .then(({ data }) => setClientData(data));
  }, [clientId, shop]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time messages
  useEffect(() => {
    if (!shop || !clientId) return;
    const channel = supabaseClient
      .channel(`chat-${clientId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `client_id=eq.${clientId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
    return () => channel.unsubscribe();
  }, [clientId, shop]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    try {
      // Log message in DB
      const msg = await db.logMessage({
        shop_id: shop.id,
        client_id: clientId,
        barber_id: barber.id,
        direction: 'outbound',
        content,
        channel: 'sms' // Linq determines actual channel
      });

      setMessages(prev => [...prev, msg]);

      // Send via Linq
      const clientPhone = clientData?.phone;
      if (clientPhone) {
        try {
          await linq.sendCustom(linq.formatPhone(clientPhone), content);
        } catch (e) {
          console.log('Linq send (sandbox):', e);
        }
      }
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setSending(false);
    }
  };

  // Quick replies based on context
  const getQuickReplies = () => {
    const replies = [];
    if (clientData) {
      const nextAppt = clientData.appointments?.find(a => a.status === 'confirmed' && new Date(a.start_time) > new Date());
      if (nextAppt) {
        replies.push(`Your next appointment is ${utils.formatDate(nextAppt.start_time)} at ${utils.formatTime(nextAppt.start_time)}`);
      }
      if (clientData.usual_preferences && Object.keys(clientData.usual_preferences).length > 0) {
        const prefs = Object.entries(clientData.usual_preferences).map(([k, v]) => `${k}: ${v}`).join(', ');
        replies.push(`Your usual: ${prefs}. Same this time?`);
      }
    }
    replies.push('When would you like to come in?');
    replies.push("You're all set! See you then.");
    return replies;
  };

  return (
    <>
      {/* Chat Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: utils.stringToColor(clientName),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, color: 'white'
        }}>
          {utils.getInitials(clientName)}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{clientName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {clientData?.phone ? utils.formatPhone(clientData.phone) : ''}
            {clientData?.visit_count > 0 && ` · ${clientData.visit_count} visits`}
          </div>
        </div>

        {/* Client context badges */}
        {clientData?.usual_preferences && Object.keys(clientData.usual_preferences).length > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(clientData.usual_preferences).slice(0, 3).map(([k, v]) => (
              <span key={k} className="badge badge-blue" style={{ fontSize: 11 }}>
                {k}: {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
            marginBottom: 8
          }}>
            <div style={{
              maxWidth: '70%', padding: '10px 14px',
              borderRadius: msg.direction === 'outbound' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.direction === 'outbound' ? 'var(--imessage-blue)' : 'var(--bg-card)',
              color: msg.direction === 'outbound' ? 'white' : 'var(--text-primary)',
              fontSize: 14, lineHeight: 1.5
            }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              <div style={{
                fontSize: 10, marginTop: 4,
                color: msg.direction === 'outbound' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                textAlign: 'right'
              }}>
                {msg.created_at ? utils.relativeTime(msg.created_at) : ''}
                {msg.channel && ` · ${msg.channel}`}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div style={{ padding: '0 20px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {getQuickReplies().map((reply, i) => (
          <button
            key={i}
            onClick={() => setNewMessage(reply)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 12, padding: '4px 10px' }}
          >
            {reply.length > 40 ? reply.slice(0, 40) + '...' : reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8
      }}>
        <input
          className="input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          style={{ flex: 1 }}
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary"
          disabled={sending || !newMessage.trim()}
          style={{ padding: '12px 20px' }}
        >
          {sending ? '...' : 'Send'}
        </button>
      </div>
    </>
  );
}

window.MessagesView = MessagesView;
