import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = join(import.meta.dirname, "..");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readMd(filePath) {
  return readFileSync(filePath, "utf-8");
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key && value) fm[key] = value;
  }
  return fm;
}

function getAgentFiles() {
  const dir = join(ROOT, "agents");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ name: f, path: join(dir, f) }));
}

function getSkillDirs() {
  const dir = join(ROOT, "skills");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      name: d.name,
      path: join(dir, d.name),
      skillMd: join(dir, d.name, "SKILL.md"),
    }));
}

const VALID_MODELS = ["haiku", "sonnet", "opus"];
const VALID_TOOLS = [
  "Read",
  "Write",
  "Edit",
  "MultiEdit",
  "Bash",
  "Grep",
  "Glob",
  "WebFetch",
  "WebSearch",
  "Task",
];

// ─── Plugin Structure ────────────────────────────────────────────────────────

describe("Plugin Structure", () => {
  it("has .claude-plugin/plugin.json", () => {
    const p = join(ROOT, ".claude-plugin", "plugin.json");
    assert.ok(existsSync(p), "Missing .claude-plugin/plugin.json");
    const data = JSON.parse(readFileSync(p, "utf-8"));
    assert.ok(data.name, "plugin.json must have a name");
    assert.ok(data.version, "plugin.json must have a version");
    assert.ok(data.description, "plugin.json must have a description");
  });

  it("has .claude-plugin/marketplace.json", () => {
    const p = join(ROOT, ".claude-plugin", "marketplace.json");
    assert.ok(existsSync(p), "Missing .claude-plugin/marketplace.json");
    const data = JSON.parse(readFileSync(p, "utf-8"));
    assert.ok(data.name, "marketplace.json must have a name");
    assert.ok(data.plugins?.length > 0, "marketplace.json must have plugins");
  });

  it("has agents/ directory with .md files", () => {
    const agents = getAgentFiles();
    assert.ok(agents.length > 0, "No agent files found in agents/");
  });

  it("has skills/ directory with SKILL.md files", () => {
    const skills = getSkillDirs();
    const withSkillMd = skills.filter((s) => existsSync(s.skillMd));
    assert.ok(withSkillMd.length > 0, "No SKILL.md files found in skills/");
  });

  it("has README.md", () => {
    assert.ok(existsSync(join(ROOT, "README.md")), "Missing README.md");
  });

  it("has LICENSE", () => {
    assert.ok(existsSync(join(ROOT, "LICENSE")), "Missing LICENSE");
  });

  it("has package.json", () => {
    assert.ok(existsSync(join(ROOT, "package.json")), "Missing package.json");
  });

  it("has settings.json", () => {
    assert.ok(
      existsSync(join(ROOT, "settings.json")),
      "Missing settings.json"
    );
  });
});

// ─── Agent Validation ────────────────────────────────────────────────────────

describe("Agent Frontmatter", () => {
  const agents = getAgentFiles();

  for (const agent of agents) {
    describe(agent.name, () => {
      const content = readMd(agent.path);
      const fm = parseFrontmatter(content);

      it("has valid frontmatter", () => {
        assert.ok(fm, `${agent.name} is missing YAML frontmatter (---)`);
      });

      it("has name field", () => {
        assert.ok(fm?.name, `${agent.name} frontmatter missing 'name'`);
      });

      it("has description field", () => {
        assert.ok(
          fm?.description,
          `${agent.name} frontmatter missing 'description'`
        );
      });

      it("has valid model field", () => {
        assert.ok(fm?.model, `${agent.name} frontmatter missing 'model'`);
        assert.ok(
          VALID_MODELS.includes(fm.model),
          `${agent.name} has invalid model '${fm.model}'. Valid: ${VALID_MODELS.join(", ")}`
        );
      });

      it("has tools field", () => {
        assert.ok(fm?.tools, `${agent.name} frontmatter missing 'tools'`);
      });

      it("has valid tools", () => {
        if (!fm?.tools) return;
        const tools = fm.tools.split(",").map((t) => t.trim());
        for (const tool of tools) {
          assert.ok(
            VALID_TOOLS.includes(tool),
            `${agent.name} has invalid tool '${tool}'. Valid: ${VALID_TOOLS.join(", ")}`
          );
        }
      });

      it("has substantive instructions (>50 lines)", () => {
        const lines = content.split("\n").length;
        assert.ok(
          lines > 50,
          `${agent.name} only has ${lines} lines — agents should have detailed instructions`
        );
      });

      it("has output format section", () => {
        assert.ok(
          content.includes("## Output Format") ||
            content.includes("## Output") ||
            content.includes("output format"),
          `${agent.name} should define an output format`
        );
      });
    });
  }
});

// ─── Skill Validation ────────────────────────────────────────────────────────

describe("Skill Frontmatter", () => {
  const skills = getSkillDirs().filter((s) => existsSync(s.skillMd));

  for (const skill of skills) {
    describe(skill.name, () => {
      const content = readMd(skill.skillMd);
      const fm = parseFrontmatter(content);

      it("has valid frontmatter", () => {
        assert.ok(fm, `${skill.name} SKILL.md is missing YAML frontmatter`);
      });

      it("has name field", () => {
        assert.ok(fm?.name, `${skill.name} frontmatter missing 'name'`);
      });

      it("has description field", () => {
        assert.ok(
          fm?.description,
          `${skill.name} frontmatter missing 'description'`
        );
      });

      it("name matches directory name", () => {
        if (!fm?.name) return;
        assert.equal(
          fm.name,
          skill.name,
          `Skill name '${fm.name}' doesn't match directory '${skill.name}'`
        );
      });

      it("has execution flow section", () => {
        assert.ok(
          content.includes("## Execution Flow") ||
            content.includes("## Execution") ||
            content.includes("## Flow") ||
            content.includes("## Quick"),
          `${skill.name} should describe its execution flow`
        );
      });

      it("security skills have authorization gate", () => {
        const securitySkills = [
          "recon",
          "exploit-dev",
          "web-scan",
          "pivot",
          "osint",
        ];
        if (securitySkills.includes(skill.name)) {
          assert.ok(
            content.toLowerCase().includes("authorization") ||
              content.toLowerCase().includes("authorized"),
            `Security skill ${skill.name} must have an authorization gate`
          );
        }
      });

      it("dangerous skills have disable-model-invocation", () => {
        const dangerousSkills = ["exploit-dev", "web-scan", "pivot"];
        if (dangerousSkills.includes(skill.name)) {
          assert.ok(
            fm?.["disable-model-invocation"] === "true" ||
              fm?.["disable-mode-invocation"] === "true",
            `Dangerous skill ${skill.name} should have disable-model-invocation: true`
          );
        }
      });
    });
  }
});

// ─── Cross-Reference Validation ──────────────────────────────────────────────

describe("Cross-References", () => {
  const agentNames = getAgentFiles().map((a) =>
    basename(a.name, ".md")
  );
  const skillNames = getSkillDirs()
    .filter((s) => existsSync(s.skillMd))
    .map((s) => s.name);

  it("has at least 10 agents", () => {
    assert.ok(
      agentNames.length >= 10,
      `Only ${agentNames.length} agents — target is 10+`
    );
  });

  it("has at least 15 skills", () => {
    assert.ok(
      skillNames.length >= 15,
      `Only ${skillNames.length} skills — target is 15+`
    );
  });

  it("skills reference only existing agents", () => {
    for (const skill of getSkillDirs().filter((s) => existsSync(s.skillMd))) {
      const content = readMd(skill.skillMd);
      // Check for backtick-wrapped agent references
      const refs = content.match(/`(\w[\w-]*-agent|\w[\w-]*er|synthesizer|decompiler|web-scanner|malware-analyst|social-engineer)`/g);
      if (!refs) continue;
      for (const ref of refs) {
        const name = ref.replace(/`/g, "");
        // Only check names that look like agent names
        if (
          agentNames.includes(name) ||
          !name.match(
            /(-agent|researcher|synthesizer|decompiler|web-scanner|malware-analyst|social-engineer)$/
          )
        ) {
          continue;
        }
        assert.fail(
          `Skill ${skill.name} references agent '${name}' which doesn't exist`
        );
      }
    }
  });
});

// ─── Hooks Validation ────────────────────────────────────────────────────────

describe("Hooks", () => {
  it("has hooks/hooks.json", () => {
    const p = join(ROOT, "hooks", "hooks.json");
    assert.ok(existsSync(p), "Missing hooks/hooks.json");
  });

  it("hooks.json is valid JSON with hooks array", () => {
    const p = join(ROOT, "hooks", "hooks.json");
    if (!existsSync(p)) return;
    const data = JSON.parse(readFileSync(p, "utf-8"));
    assert.ok(Array.isArray(data.hooks), "hooks.json must have a hooks array");
    assert.ok(data.hooks.length > 0, "hooks array should not be empty");
  });

  it("each hook has matcher and hooks", () => {
    const p = join(ROOT, "hooks", "hooks.json");
    if (!existsSync(p)) return;
    const data = JSON.parse(readFileSync(p, "utf-8"));
    for (const hook of data.hooks) {
      assert.ok(hook.matcher, "Each hook must have a matcher");
      assert.ok(
        Array.isArray(hook.hooks),
        "Each hook must have a hooks array"
      );
    }
  });
});

// ─── Content Quality ─────────────────────────────────────────────────────────

describe("Content Quality", () => {
  it("total agent lines > 1400", () => {
    let total = 0;
    for (const agent of getAgentFiles()) {
      total += readMd(agent.path).split("\n").length;
    }
    assert.ok(
      total > 1400,
      `Total agent content is only ${total} lines — should be 1400+`
    );
  });

  it("total skill lines > 1500", () => {
    let total = 0;
    for (const skill of getSkillDirs().filter((s) => existsSync(s.skillMd))) {
      total += readMd(skill.skillMd).split("\n").length;
    }
    assert.ok(
      total > 1500,
      `Total skill content is only ${total} lines — should be 1500+`
    );
  });

  it("no TODO or FIXME markers in production files", () => {
    const files = [
      ...getAgentFiles().map((a) => a.path),
      ...getSkillDirs()
        .filter((s) => existsSync(s.skillMd))
        .map((s) => s.skillMd),
    ];
    for (const f of files) {
      const content = readMd(f);
      assert.ok(
        !content.match(/\b(TODO|FIXME|HACK|XXX)\b/),
        `${basename(f)} contains TODO/FIXME markers`
      );
    }
  });
});
