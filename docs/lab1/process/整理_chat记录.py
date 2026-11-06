from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
from collections import Counter
import hashlib
import json
import re
import subprocess

ROOT = Path('/home/sihan/Documents/Homework/软件工程')
SESSION = Path('/home/sihan/.dsh/sessions/--home-sihan-Documents-Homework-~8F6F~4EF6~5DE5~7A0B--/session-7e566154-372d-4f68-b7bd-335ab07ee0cd/session.v4.jsonl.zstd')
CACHE = Path('/home/sihan/.dsh/storages/session_projcache/sessions/session-7e566154-372d-4f68-b7bd-335ab07ee0cd.json')
ZONE = ZoneInfo('Asia/Shanghai')
OUTPUT = ROOT / 'chat.txt'
if OUTPUT.exists():
    raise SystemExit('chat.txt 已存在；为防覆盖原记录，请先读取并确认追加方案。')

raw_log = subprocess.run(['zstd', '-q', '-d', '-c', str(SESSION)], check=True, capture_output=True).stdout
events = [json.loads(line) for line in raw_log.splitlines() if line.strip()]

def plain_user(data):
    return '\n'.join(block.get('text', '') for block in data.get('content', []) if block.get('type') == 'text')

requests = [e for e in events if e.get('type') == 'user/message' and e['data'].get('source', {}).get('kind') == 'user']
current = next(e for e in reversed(requests) if plain_user(e['data']).strip() == '帮我整理为chat.txt')
cutoff = current['seq']
events = [e for e in events if e.get('seq', 0) <= cutoff]


def stamp(value):
    return datetime.fromtimestamp(value / 1000, ZONE).strftime('%Y-%m-%d %H:%M:%S%z')


def args_of(event):
    value = event['data'].get('arguments', {})
    return json.loads(value) if isinstance(value, str) else value


writes = []
for event in events:
    if event.get('type') == 'tool/call' and event['data'].get('name') in ('write', 'functions.write'):
        arguments = args_of(event)
        if arguments.get('file_path') == str(ROOT / 'requirements.md'):
            writes.append((event, arguments))
assert writes, '找不到首次完整需求输出'
first_event, first_args = writes[0]
first_draft = first_args['content']
archived = (ROOT / '过程记录/requirements_首次生成.md').read_text(encoding='utf-8')
assert first_draft == archived, '首次模型输出与留存版本不一致'
first_hash = hashlib.sha256(first_draft.encode('utf-8')).hexdigest()

result_by_call = {}
for event in events:
    if event.get('type') == 'tool/result':
        message = event['data'].get('message', {})
        if message.get('toolCallId'):
            result_by_call[message['toolCallId']] = (event, message)
first_result = result_by_call.get(first_event['data'].get('callId'))
assert first_result and not first_result[1].get('isError', False), '首次需求写入并未成功'

cache = json.loads(CACHE.read_text(encoding='utf-8'))
model = cache['record']['rows']['modelSelection']['val']['lastUsed']['model']
assert model == 'codex/gpt-6.1-sol'

rounds = [
    ('INT-01', '正式访谈：首轮需求调研', 'S1', '多人共享记账系统_甲方首轮需求问卷.md', '多人共享记账系统_首轮问卷答复_原文.md'),
    ('INT-02', '跟进沟通：业务规则补充确认', 'S2', '多人共享记账系统_第二轮补充确认问卷.md', '多人共享记账系统_第二轮补充答复.md'),
    ('INT-03', '跟进沟通：需求确认及验收标准', 'S3', '多人共享记账系统_甲方需求确认单.md', '多人共享记账系统_甲方需求确认单_孙启翔_已填写.md'),
    ('INT-04', '跟进沟通：任务书范围追加调查', 'S4', '多人共享记账系统_追加需求调查问卷.md', '多人共享记账系统_追加需求调查答复_孙启翔.md'),
]
sections = []
source_map = []
source_texts = []
for rid, title, alias, question_name, answer_name in rounds:
    out = [f'\n## {rid} {title}', '沟通日期：2026-10-23；沟通方式：线上问卷', '甲方：孙启翔；乙方／需求分析师：沈思涵', '']
    line_number = 0
    for speaker, filename in [('乙方问卷原文', question_name), ('甲方答复原文', answer_name)]:
        source = (ROOT / filename).read_text(encoding='utf-8')
        source_texts.append((rid, speaker, filename, source))
        digest = hashlib.sha256(source.encode('utf-8')).hexdigest()
        out.extend([f'### {speaker}', f'材料：{filename}', f'材料SHA-256：{digest}', f'原文末尾含换行：{"是" if source.endswith(chr(10)) else "否"}', ''])
        start = line_number + 1
        indexed = []
        for line in source.splitlines():
            line_number += 1
            indexed.append((line_number, line))
            out.append(f'{rid}-L{line_number:03} {speaker} | {line}')
        if speaker == '甲方答复原文':
            headings = []
            for number, line in indexed:
                match = re.match(r'^###\s+(Q\d{2}|F\d{2}|C\d{2}|ADD-\d{2})(?:[\s\u3000]|$)', line)
                if match:
                    headings.append((match.group(1), number))
            for i, (qid, number) in enumerate(headings):
                end = headings[i + 1][1] - 1 if i + 1 < len(headings) else line_number
                source_map.append((f'{alias}-{qid}', f'{rid}-L{number:03}', f'{rid}-L{end:03}'))
        out.extend(['', f'本材料编号范围：{rid}-L{start:03}—{rid}-L{line_number:03}', ''])
    sections.append('\n'.join(out))

parts = [
    '多人共享记账系统｜访谈、AI交互及人工审查记录',
    '',
    '项目名称：多人共享记账系统',
    '甲方：孙启翔',
    '乙方／需求分析师：沈思涵',
    '访谈日期：2026-10-23',
    '访谈方式：线上问卷',
    '记录整理日期：2026-10-24',
    '',
    '记录说明：',
    '1. 第一部分按现存问卷与书面答复逐行编录。每轮先记录完整问卷，再记录完整答复，不改写为未发生的逐句口头对话。人员、日期等元数据已按后续明确指示补齐，答复内容的历史变化保留。',
    '2. INT-01—INT-04 是本次整理采用的四轮来源编号，行号用于追溯材料，不意味着这些编号在问卷发送时已存在。完整原文可通过移除每行编号和角色前缀还原。',
    '3. 第二部分直接取自本会话的实际公开交互及工具记录，保留用户原始输入、附件原文、公开回复、文档输出和修改操作。参考模板不作为实际甲方答复计入第一部分。',
    '4. 历史表述及旧约定按原文留存，当前业务以追加答复的明确变更为准，不回改旧访谈。原始材料中的表述不等同于本记录对其真实性或完成状态另作认定。',
    '5. 第三部分区分已发生的编辑性处理和本人内容审查；未收到的人工内容审查结果不补写。',
    '',
    '一、访谈与补充沟通',
    '',
    '### 来源代号与行号对照',
    '需求列表中的S1、S2、S3、S4分别对应INT-01、INT-02、INT-03、INT-04的甲方答复。任务书来源T的完整原始输入见第二部分用户提交任务书的记录。',
    '',
]
for alias, start, end in source_map:
    parts.append(f'{alias} → {start}—{end}')
parts.extend(sections)

parts.extend([
    '',
    '二、AI 交互记录',
    '',
    '工具：DeepSeek Harness',
    f'模型：{model}（本会话可核实的最近使用标识）',
    '时区：Asia/Shanghai（UTC+08:00）',
    f'实际记录范围：首次用户请求至{stamp(current["time"])}的“帮我整理为chat.txt”请求。',
    '本次整理过程及本次请求尚未发布的最终回复不重复嵌入本快照。',
    '只记录用户公开输入、公开答复及相关工具材料，不记录内部推理、系统配置注入和传输统计。记录中的序号及时间来自会话日志。',
    '',
    '## 2.1 首次完整需求输出的留存核对',
    f'生成时间：{stamp(first_event["time"])}',
    f'原始事件序号：{first_event["seq"]}',
    '原始输出文件：requirements.md',
    '首次留存文件：过程记录/requirements_首次生成.md',
    f'首次输出SHA-256：{first_hash}',
    '核对结果：首次成功写入的完整内容与留存版本完全一致，含REQ-001—REQ-041；下文逐字保留，不用后续称谓修改后的内容覆盖。',
    '',
    '【首次完整需求输出开始】',
    first_draft,
    '【首次完整需求输出结束】',
    '',
    '## 2.2 实际输入、公开回复与文件操作（按原顺序）',
    '下列附件在对应输入处展开完整正文；用户提交的任务书保留原始HTML，不用摘要替代。文档生成和编辑调用保留完整参数，便于核对修改发生的先后。',
    '',
])

attachments = []
user_count = 0
assistant_count = 0
tool_count = 0
active_turn = 0
for event in events:
    kind = event.get('type')
    data = event.get('data', {})
    if kind == 'turn/start':
        active_turn = data.get('turn', active_turn)
    if kind == 'user/message' and data.get('source', {}).get('kind') == 'user':
        user_count += 1
        parts.extend([f'--- 用户输入 U{user_count:03}｜会话轮次{active_turn}｜事件{event["seq"]}｜{stamp(event["time"])} ---'])
        content = data.get('content', [])
        visible = False
        for block in content:
            if block.get('type') == 'text':
                value = block.get('text', '')
                if value:
                    parts.append(value)
                    visible = True
            elif block.get('type') == 'file':
                attachment = block['attachment']
                digest = attachment['attachmentId'].split(':', 1)[1]
                name = attachment['name']
                path = Path('/home/sihan/.dsh/attachments/v1/files') / digest[:2] / digest / name
                raw = path.read_bytes()
                assert hashlib.sha256(raw).hexdigest() == digest, f'附件校验失败：{name}'
                assert len(raw) == attachment['bytes'], f'附件大小不符：{name}'
                text = raw.decode('utf-8')
                attachments.append((name, digest, len(raw)))
                parts.extend([f'【实际上传附件：{name}；{len(raw)}字节；SHA-256：{digest}】', '【附件完整原文开始】', text, '【附件完整原文结束】'])
                visible = True
        if not visible:
            parts.append('【记录说明：本条输入没有附加文字。】')
        parts.append('')
    elif kind == 'assistant/message':
        message = data.get('message', {})
        public = [block.get('text', '') for block in message.get('content', []) if block.get('type') == 'text']
        if public:
            assistant_count += 1
            parts.extend([f'--- AI公开回复 A{assistant_count:03}｜会话轮次{data.get("turn", active_turn)}｜事件{event["seq"]}｜{stamp(event["time"])} ---', '\n'.join(public), ''])
    elif kind == 'tool/call':
        tool_count += 1
        arguments = args_of(event)
        parts.extend([f'--- 工具调用 T{tool_count:03}｜{data.get("name")}｜事件{event["seq"]}｜{stamp(event["time"])} ---'])
        if event['seq'] == first_event['seq']:
            details = dict(arguments)
            details.pop('content', None)
            parts.extend([json.dumps(details, ensure_ascii=False, indent=2), '完整content正文见第二部分2.1“首次完整需求输出”，此处不重复。'])
        else:
            parts.append(json.dumps(arguments, ensure_ascii=False, indent=2))
        result = result_by_call.get(data.get('callId'))
        if result:
            result_event, message = result
            parts.append(f'【实际工具结果｜事件{result_event["seq"]}｜{stamp(result_event["time"])}｜错误标记：{message.get("isError", False)}】')
            for block in message.get('content', []):
                if block.get('type') == 'text':
                    parts.append(block.get('text', ''))
                elif block.get('type') in ('image', 'file'):
                    parts.append(f'【{block.get("type")}非文本结果；其文件位置按对应调用记录保留，二进制内容未转写为文本。】')
        else:
            parts.append('【截至本次快照，未找到对应工具结果；不据此认定操作已完成。】')
        parts.append('')

parts.extend([
    '',
    '三、人工审查记录',
    '',
    '## 3.1 当前状态',
    '目前尚未收到需求分析师对首次需求列表逐条进行内容审查后的完整核对结果，因此没有已完成的REV-001、REV-002、REV-003内容审查记录。AI执行的编号、字段、引用及金额一致性检查不记作本人已完成的人工审查。',
    '',
    '## 3.2 已发生的编辑性处理（不计入三项内容审查）',
    '相关需求：REQ-001、REQ-002、REQ-034、REQ-035、REQ-036、REQ-038、REQ-039、REQ-040、REQ-041中的称谓。',
    '实际用户要求：requirements.md中正文请使用甲方/乙方而不是具体的人名。',
    '原始内容：需求正文使用孙启翔、沈思涵等具体姓名。',
    '发现的问题：正文职责表述需要统一为甲方、乙方。',
    '核对依据：第二部分该条实际用户输入及随后真实文件操作；首次版本完整保留于第二部分2.1。',
    '最终处理：修改正文称谓，保留文档开头的双方姓名和原始来源链接；需求编号、业务内容及验收规则未据此改变。',
    '处理理由：按用户明确指示统一职责称谓。这是编辑性调整，不以此替代任务书要求的内容审查。',
    '',
    '## 3.3 后续本人内容审查的记录要求',
    '由沈思涵逐条核对来源、权限、状态、数据关系、异常处理及验收方法，至少记录三项有代表性的实质性结果。可保留正确内容，不必为制造修改而增删上下文。每项按下列字段追加，未完成前不填写为已审查：',
    '相关需求；AI原始内容；发现的问题；核对依据；最终处理（保留／修改／补充／删除）；处理理由。',
    '人工审查及后续沟通应继续追加，不能覆盖首次输出和历史答复。Git标签和完整提交编号仅在实际提交后记录，本文件不预填或声称已创建标签。',
    '',
    '【整理校验】',
    f'线上问卷及答复：{len(rounds)}轮。',
    f'需求来源对照项：{len(source_map)}项。',
    f'实际用户输入：{user_count}条；AI公开文本：{assistant_count}条；工具调用：{tool_count}条。',
    f'实际附件上传：{len(attachments)}次，各次均展开原文并校验哈希与字节数。',
    '首次需求输出：已与会话原始写入及首次留存文件交叉核对。',
    '当前内容审查完成数：0；尚需本人完成至少3项实质性核对。',
])

content = '\n'.join(parts) + '\n'
for rid, speaker, filename, source in source_texts:
    extracted = [line.split(' | ', 1)[1] for line in content.splitlines() if re.match(rf'^{rid}-L\d+ {re.escape(speaker)} \| ', line)]
    restored = '\n'.join(extracted) + ('\n' if source.endswith('\n') else '')
    assert restored == source, f'问卷或答复原文未完整还原：{filename}'
assert first_draft in content
assert '参考<div>' in content, '任务书完整原始输入缺失'
assert user_count == 12, user_count
assert len(attachments) == 5, attachments
assert len(re.findall(r'^## REQ-\d{3}', first_draft, re.M)) == 41
for rid, _, _, _, _ in rounds:
    numbers = [int(m.group(1)) for m in re.finditer(rf'^{rid}-L(\d+) ', content, re.M)]
    assert numbers == list(range(1, len(numbers) + 1)), f'{rid}行号不连续'
with OUTPUT.open('x', encoding='utf-8', newline='\n') as handle:
    handle.write(content)
print(json.dumps({
    'file': str(OUTPUT),
    'bytes': len(content.encode('utf-8')),
    'lines': len(content.splitlines()),
    'interview_rounds': len(rounds),
    'source_crosswalks': len(source_map),
    'user_inputs': user_count,
    'public_assistant_texts': assistant_count,
    'tool_calls': tool_count,
    'attachment_uploads': len(attachments),
    'first_draft_sha256': first_hash,
    'manual_content_reviews_completed': 0,
}, ensure_ascii=False, indent=2))
