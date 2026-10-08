interface WeChatProps {
  onClose?: () => void;
}

export default function WeChat({ onClose }: WeChatProps) {
  const [copied, setCopied] = useState(false);

  const copyPhone = async () => {
    await navigator.clipboard.writeText("18621352418");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="wechat-card wechat-drag relative size-full overflow-hidden" style={{ height: "100%", width: "100%" }}>
      <img
        src="img/ui/wechat-qr.png"
        alt="WeChat QR code"
        draggable={false}
        className="block size-full"
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
      <button className="wechat-close" type="button" aria-label="Close WeChat" onClick={onClose}>
        <span className="wechat-close-x">×</span>
      </button>
      <button
        className="wechat-phone"
        type="button"
        onClick={(event) => {
          if (event.target === event.currentTarget) return;
          copyPhone();
        }}
        aria-label="Copy phone number"
      >
        <span className="wechat-phone-tooltip">18621352418</span>
      </button>
      {copied && <div className="wechat-toast">已复制</div>}
    </div>
  );
}
