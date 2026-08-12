import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function exec(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

/** Convert legacy plain-text/markdown-ish bodies into HTML for the editor. */
export function toEditorHtml(text: string) {
  const value = (text || "").trim();
  if (!value) return "";
  if (/<(p|h[1-6]|ul|ol|div|img|blockquote)\b/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith("# ")) return `<h2>${block.slice(2)}</h2>`;
      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter((l) => l.startsWith("- "))
          .map((l) => `<li>${l.slice(2)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${block.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}

const BLOCKS = [
  { value: "p", label: "Body" },
  { value: "h2", label: "Tiêu đề lớn" },
  { value: "h3", label: "Tiêu đề nhỏ" },
];

const SIZES = [
  { value: "2", label: "Nhỏ" },
  { value: "3", label: "Vừa" },
  { value: "5", label: "Lớn" },
  { value: "6", label: "Rất lớn" },
];

export function RichEditor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) el.innerHTML = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit() {
    onChange(ref.current?.innerHTML ?? "");
  }

  function run(cmd: string, val?: string) {
    ref.current?.focus();
    exec(cmd, val);
    emit();
  }

  function addLink() {
    const url = prompt("Nhập đường dẫn (https://...)");
    if (!url) return;
    run("createLink", url);
  }

  async function uploadImage(file: File) {
    setErr("");
    if (file.size > 5 * 1024 * 1024) {
      setErr("Ảnh tối đa 5MB.");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    setUploading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    run("insertHTML", `<p><img src="/api/public/blog-media/${path}" alt="" /></p>`);
  }

  return (
    <div className="admin-field">
      {label ? <label>{label}</label> : null}
      <div className="rte">
        <div className="rte-bar">
          <select
            className="rte-select"
            defaultValue="p"
            onChange={(e) => run("formatBlock", `<${e.target.value}>`)}
            title="Kiểu chữ"
          >
            {BLOCKS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          <select
            className="rte-select"
            defaultValue="3"
            onChange={(e) => run("fontSize", e.target.value)}
            title="Cỡ chữ"
          >
            {SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <span className="rte-sep" />
          <button type="button" className="rte-btn" title="In đậm" onClick={() => run("bold")}>
            <Bold size={15} />
          </button>
          <button type="button" className="rte-btn" title="In nghiêng" onClick={() => run("italic")}>
            <Italic size={15} />
          </button>
          <button
            type="button"
            className="rte-btn"
            title="Gạch chân"
            onClick={() => run("underline")}
          >
            <Underline size={15} />
          </button>

          <span className="rte-sep" />
          <label className="rte-btn" title="Màu chữ">
            <Palette size={15} />
            <input type="color" onChange={(e) => run("foreColor", e.target.value)} />
          </label>
          <label className="rte-btn" title="Highlight">
            <Highlighter size={15} />
            <input type="color" onChange={(e) => run("hiliteColor", e.target.value)} />
          </label>

          <span className="rte-sep" />
          <button
            type="button"
            className="rte-btn"
            title="Danh sách"
            onClick={() => run("insertUnorderedList")}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className="rte-btn"
            title="Danh sách số"
            onClick={() => run("insertOrderedList")}
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            className="rte-btn"
            title="Trích dẫn"
            onClick={() => run("formatBlock", "<blockquote>")}
          >
            <Quote size={15} />
          </button>

          <span className="rte-sep" />
          <button
            type="button"
            className="rte-btn"
            title="Căn trái"
            onClick={() => run("justifyLeft")}
          >
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            className="rte-btn"
            title="Căn giữa"
            onClick={() => run("justifyCenter")}
          >
            <AlignCenter size={15} />
          </button>
          <button
            type="button"
            className="rte-btn"
            title="Căn phải"
            onClick={() => run("justifyRight")}
          >
            <AlignRight size={15} />
          </button>
          <button
            type="button"
            className="rte-btn"
            title="Căn đều"
            onClick={() => run("justifyFull")}
          >
            <AlignJustify size={15} />
          </button>

          <span className="rte-sep" />
          <button type="button" className="rte-btn" title="Chèn liên kết" onClick={addLink}>
            <Link2 size={15} />
          </button>
          <label className="rte-btn" title="Chèn ảnh">
            <ImagePlus size={15} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void uploadImage(f);
              }}
            />
          </label>
          <button
            type="button"
            className="rte-btn"
            title="Xóa định dạng"
            onClick={() => run("removeFormat")}
          >
            <RemoveFormatting size={15} />
          </button>

          <span className="rte-sep" />
          <button type="button" className="rte-btn" title="Hoàn tác" onClick={() => run("undo")}>
            <Undo2 size={15} />
          </button>
          <button type="button" className="rte-btn" title="Làm lại" onClick={() => run("redo")}>
            <Redo2 size={15} />
          </button>
        </div>
        <div
          ref={ref}
          className="rte-area"
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
        />
      </div>
      {uploading ? <p className="admin-note">Đang tải ảnh lên...</p> : null}
      {err ? <p className="admin-error">{err}</p> : null}
    </div>
  );
}
